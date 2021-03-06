# Projects

Every project is owned by a user. The project is in the user home in /userhome/projects/
The project name cannot contain .-, in the name.

### Add a project

`POST` /projects/add

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `name` | yes | The name of the project |
| `language` | yes | The language in which the project is developed |

#### Response 

200 OK
````json
{
	"err": 0
}
````

### List all projects

`GET` /projects/list

List all the projects of the logged in user

#### Response 

200 OK
````json
{
	"err": 0,
	"projects": [
		{
			"name": "project1"
		}, 
		{
			"name": "project2"
		}
		....
	]
}
````

### Save file

`POST` /projects/files/save

Save a file to the project. The path cannot contain ../.. 

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `project` | yes | The name of the project |
| `file` | yes | The name of the file meaning the relative path to the project |
| `data` | yes | The data to be saved in the file |

#### Response 

200 OK
````json
{
	"err": 0
}
````

### Load file

`POST` /projects/files/load

Load a file from the project. The path cannot contain ../.. 

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `project` | yes | The name of the project |
| `file` | yes | The name of the file meaning the relative path to the project |

#### Response 

200 OK
````json
{
	"err": 0
}
````