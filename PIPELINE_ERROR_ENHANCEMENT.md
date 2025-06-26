# MongoDB Pipeline Error Enhancement

## Overview

This enhancement modifies the MongoDB Node.js driver to provide detailed information when pipeline errors (code 40323) occur. When this specific error is detected, the application will:

1. **Log detailed command information** including the database, collection, and full pipeline that caused the error
2. **Exit the application** to prevent further execution with the problematic query

## Changes Made

### Modified Files

1. **`src/cmap/connection.ts`** - Enhanced error handling in two locations:
   - `sendCommand` method (lines ~550-600)
   - `command` method (lines ~680-720)

### Error Detection

The enhancement specifically targets MongoDB error code **40323** which corresponds to:
```
"A pipeline stage specification object must contain exactly one field."
```

### Enhanced Error Information

When this error occurs, the driver now provides:

- **Database name** where the query was executed
- **Collection name** that was targeted
- **Full pipeline** that caused the error
- **Complete command object** for debugging

### Example Output

When a pipeline error occurs, you'll see output like:

```
CRITICAL PIPELINE ERROR DETECTED:
Pipeline Error (40323): A pipeline stage specification object must contain exactly one field.

Command Details:
Database: myDatabase
Collection: myCollection
Pipeline: [
  {
    "$match": {
      "field": "value"
    }
  },
  {
    "$invalidStage": {}
  }
]

Full Command: {
  "aggregate": "myCollection",
  "pipeline": [
    {
      "$match": {
        "field": "value"
      }
    },
    {
      "$invalidStage": {}
    }
  ],
  "cursor": {}
}
```

## Usage

### Testing the Enhancement

1. **Build the driver:**
   ```bash
   npm run build:ts
   ```

2. **Run the test script:**
   ```bash
   node test-pipeline-error.js
   ```

### In Your Application

The enhancement works automatically. When your application encounters a pipeline error (40323), it will:

1. Log the detailed error information
2. Exit with code 1

### Logging

The enhancement uses the existing MongoDB logger if available, otherwise falls back to console output. The logger will include:

- Error message
- Command details
- Full pipeline information
- Database and collection context

## Benefits

1. **Immediate identification** of problematic queries
2. **Detailed debugging information** without needing to enable verbose logging
3. **Application termination** to prevent cascading errors
4. **Structured logging** that integrates with existing MongoDB logging infrastructure

## Error Code Reference

- **40323**: "A pipeline stage specification object must contain exactly one field"
- This typically occurs when:
  - A pipeline stage is empty `{}`
  - A pipeline stage has multiple top-level fields
  - An invalid stage name is used

## Example Problematic Queries

```javascript
// ❌ Empty stage object
db.collection.aggregate([
  { $match: { field: 'value' } },
  {} // This will cause error 40323
])

// ❌ Multiple fields in stage
db.collection.aggregate([
  { $match: { field: 'value' } },
  { $project: { field1: 1 }, $sort: { field1: 1 } } // This will cause error 40323
])

// ❌ Invalid stage name
db.collection.aggregate([
  { $match: { field: 'value' } },
  { $invalidStage: {} } // This will cause error 40323
])
```

## Reverting Changes

To revert these changes, simply restore the original `src/cmap/connection.ts` file from the git repository. 