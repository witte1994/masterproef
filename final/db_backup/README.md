# Dashboard database

Run the MongoDB server on port 27017.

You can restore a database dump using the mongorestore tool:

```
$ mongorestore -d dashboard ./dashboard
```

Or you can start clean and use the import_file.json to import several patients.