static-api
==========

A node module that reads a JSON file and generates a static folder structure that matches 
the JSON to allow data end points for simple apps without the hassle of setting up your own server.

Inspired by the [Jekyll](http://jekyllrb.com/) approach to static website hosting. You can maintian your 
'database' offline then run this script and push the changes to your live site.

## How to use

### The json file

Create a .json file that strucuture matches your desired API.

`my-api.json`

````json
{
    "artists": {
        "0123": {
            "id": "0123",
            "name": "alt-J",
            "albums": {
                "456": {
                    "id": "456",
                    "name": "An Awesome Wave",
                    "tracks": {
                        "1": {
                            "name": "intro",
                            "length": "2:37"
                        },
                        "2": {
                            "name": "Interlude I",
                            "length": "1:12"
                        }
                    }
                }
            }
        },
        "0743": {
            "id": "0743",
            "name": "The Antlers",
            "albums": {
                "457": {
                    "id": "457",
                    "name": "Burst Apart",
                    "tracks": {
                        "1": {
                            "name": "I Don't Want Love",
                            "length": "3:19"
                        }
                    }
                }
            }
        }
    }
}
````
### The code

#### Using command line

install static-api using npm

````
npm install static-api -g
````
Run in the command line like so
````
static-api -f example/data -j example/example.json
````

Where -f is the folder you would like the api to saved to and -j the path to the JSON file containing the structure

#### Using a node app

Include 'static-api' as a dependency in your package.json and create a 
file a js file similar to the code below. 

````js
var baseData = require('./my-api.json'), //load your json file
    path = require('path'), 
    staticApi = require('static-api'); //load the module


var dataFolder = path.join(__dirname, 'data/');

new staticApi({
    outputFolder: dataFolder, //where the data will be stored
    object: baseData //the object to create the file structure from
});
````

### The result

After running the js file in the command line using: node myapp.js

This should result in a simlar structure to the following
````
/data/
...../my-api.json
...../artists/
............./artists.json
............./0123/
................../0123.json
................../albums/
........................./albums.json
........................./456/
............................./456.json
............................./tracks/
..................................../tracks.json
..................................../1/
....................................../1.json
..................................../2/
....................................../2.json
............./0743/
....etc..
````    

So now if you hit the following URL from your application /data/artists/0123/albums/456/456.json you will get the following:
````json
{"id":"456","name":"An Awesome Wave","tracks":{"1":{"name":"intro","length":"2:37"},"2":{"name":"Interlude I","length":"1:12"}}}
````

You can now quickly produce a static API that you can use with your simple JavaScript app allowing you 
to focus on doing what you do best: *creating awesome web apps or producing amazing prototypes.*
