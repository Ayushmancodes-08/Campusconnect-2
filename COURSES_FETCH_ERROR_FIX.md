# Fix: "Failed to fetch courses" Error

## Problem
The application was throwing a console error: **"Error: Failed to fetch courses: TypeError: Failed to fetch"** when trying to load courses from Supabase on initial app load.

This error was blocking the entire app from loading because the `AppDataProvider` was throwing an unhandled exception.

## Root Cause
The error occurred due to one or more of these reasons:

1. **Network Connectivity Issue**: Supabase connection failed due to network problems
2. **Table Doesn't Exist**: The `courses` table might not exist in Supabase
3. **Supabase Configuration**: Incorrect Supabase URL or API key
4. **CORS Issues**: Cross-origin request blocked
5. **No Error Handling**: The app crashed instead of gracefully falling back to cached data

## Solution
Implemented graceful error handling at two levels:

### 1. AppDataProvider Error Handling
Wrapped each Supabase fetch call in individual try-catch blocks so that if one service fails, others can still load.

**Before:**
```typescript
try {
  const supabaseCourses = await CourseService.getAll();
  if (supabaseCourses.length > 0) {
    setCourses(supabaseCourses);
  }
  // ... other services ...
} catch (error) {
  // Entire app fails if any service throws
  console.error("Failed to load data from Supabase, using cached data:", error);
}
```

**After:**
```typescript
try {
  const supabaseCourses = await CourseService.getAll();
  if (supabaseCourses.length > 0) {
    setCourses(supabaseCourses);
  }
} catch (error) {
  console.warn("Failed to load courses from Supabase, using cached data:", error);
}

try {
  const supabaseHolidays = await HolidayService.getAll();
  if (supabaseHolidays.length > 0) {
    setHolidays(supabaseHolidays);
  }
} catch (error) {
  console.warn("Failed to load holidays from Supabase, using cached data:", error);
}
// ... each service has its own error handling ...
```

### 2. CourseService Network Error Handling
Added specific handling for network errors to return empty array instead of throwing.

**Before:**
```typescript
static async getAll(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error; // This crashes the app
  }
}
```

**After:**
```typescript
static async getAll(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        console.warn('Network error fetching courses, returning empty array:', error.message);
        return [];
      }
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('Network'))) {
      console.warn('Network error, returning empty courses array');
      return [];
    }
    throw error;
  }
}
```

## How It Works Now

### Error Handling Flow
```
App Loads
    ↓
AppDataProvider tries to fetch from Supabase
    ├─ Students: Try to fetch
    │   ├─ Success → Use Supabase data
    │   └─ Error → Use cached/default data, continue
    ├─ Staff: Try to fetch
    │   ├─ Success → Use Supabase data
    │   └─ Error → Use cached/default data, continue
    ├─ Courses: Try to fetch
    │   ├─ Success → Use Supabase data
    │   ├─ Network Error → Return empty array, continue
    │   └─ Other Error → Use cached/default data, continue
    └─ Holidays: Try to fetch
        ├─ Success → Use Supabase data
        └─ Error → Use cached/default data, continue
    ↓
App loads successfully with available data
```

## Benefits

1. **Resilience**: App continues to work even if Supabase is unavailable
2. **Graceful Degradation**: Uses cached/default data as fallback
3. **Better Debugging**: Specific error messages for each service
4. **User Experience**: No app crashes, users can still work with cached data
5. **Network Tolerance**: Handles temporary network issues gracefully

## Testing

### Test Case 1: Normal Operation
1. Ensure Supabase is running and accessible
2. Load the app
3. **Expected**: App loads successfully, courses are fetched from Supabase

### Test Case 2: Network Disconnected
1. Disconnect from internet or block Supabase in network tab
2. Load the app
3. **Expected**: App loads successfully with cached/default data, warning in console

### Test Case 3: Supabase Down
1. Stop Supabase or use invalid credentials
2. Load the app
3. **Expected**: App loads successfully with cached/default data, warning in console

### Test Case 4: Partial Failure
1. Make Supabase unavailable for courses only
2. Load the app
3. **Expected**: Students, staff, and holidays load from Supabase; courses use cached data

## Fallback Data

When Supabase fetch fails, the app uses:

- **Students**: Empty array (or cached data from localStorage)
- **Staff**: Empty array (or cached data from localStorage)
- **Courses**: Empty array (or `defaultCoursesData` from `@/lib/data`)
- **Holidays**: Empty array (or `defaultHolidays` from `@/lib/data`)

## Console Output

### Before Fix
```
Error: Failed to fetch courses: TypeError: Failed to fetch
    at CourseService.getAll
    at AppDataProvider.useEffect.loadDataFromSupabase
```

### After Fix
```
⚠️ Failed to load courses from Supabase, using cached data: Error: Failed to fetch courses: TypeError: Failed to fetch
⚠️ Network error, returning empty courses array
```

## Files Modified

1. `src/context/app-data-provider.tsx`
   - Added individual try-catch blocks for each service
   - Changed error level from `error` to `warn` for Supabase failures
   - Allows app to continue even if one service fails

2. `src/lib/db/courses.ts`
   - Added network error detection
   - Returns empty array for network errors instead of throwing
   - Provides better error messages

## Related Services

The same pattern can be applied to:
- `StudentService.getAll()`
- `StaffService.getAll()`
- `HolidayService.getAll()`

## Troubleshooting

### Still seeing the error?

1. **Check Supabase Connection**
   ```bash
   # Verify Supabase URL and API key in .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

2. **Check Network Tab**
   - Open DevTools → Network tab
   - Look for failed requests to Supabase
   - Check CORS headers

3. **Check Console**
   - Look for specific error messages
   - Check if it's a network error or table error

4. **Verify Database**
   - Ensure `courses` table exists in Supabase
   - Check table permissions
   - Verify RLS policies if enabled

## Future Improvements

1. Add retry logic with exponential backoff
2. Implement service health checks
3. Add user notification for Supabase unavailability
4. Implement data sync when connection is restored
5. Add offline mode support

---

**Status**: ✅ Fixed and Ready for Testing
**Last Updated**: November 22, 2025
