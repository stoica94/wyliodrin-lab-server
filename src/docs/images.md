# Images

Images are objects containing the imageId, the status of the image among other information.

## Properties

| Property | Data Type | Required | Set By | Description |
| -------- | --------- | -------- | ------ | ----------- |
| `id` | String | yes | server | A unique id for each image | 
| `filename` | String | yes | user | The name of the image |
| `status` | String Array | yes | user/server | The status of the image |
| `progress` | String Array | yes | user/server | The progress of download |