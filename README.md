# API-Faker
It's a Express server built to mock API responses.

# How to use
This express starts on port 3030 
So you just need to create a container and map you dir with mocks to /app/src/requests

# Request File Example
You can organize your requests in subdirectories and group similar requests at same JSON File.

Simple Json Example:
```JSON
{
  "plugin": "",
  "request": {
    "path": "/test",
    "method": "GET"
  },
  "response": {
    "statusCode": 200,
    "data": {
      "message": "Im listening, everything is OK =]"
    }
  }
}
```
Multiple Mocks Json Example:
```JSON
[
  {
    "plugin": "",
    "request": {
      "path": "/test/abc",
      "method": "GET"
    },
    "response": {
      "statusCode": 200,
      "data": {
        "message": "Im listening, everything is OK =]"
      }
    }
  },
  {
    "plugin": "",
    "request": {
      "path": "/test/abc/def",
      "method": "GET"
    },
    "response": {
      "statusCode": 200,
      "data": {
        "message": "Im listening, everything is OK =]"
      }
    }
  }
]
```