import Methods from './Methods'

class Backend {

  constructor(_http) {
    const base_url = process.env.API_ROOT
    this.http = _http
    this.resource = {
      job_url: base_url + "/yun110/ads/repl",
    }
  }

  submitJob(params,
    submitBefore = () => {}, 
    submitSuccess = () => {}, 
    submitFail = (msg) => {
    }) {

    const columns = [];
    // use keys to get column
    const tableData = []

    const resource = this.resource.job_url
    const options = {
      emulateJSON: true
    }
    const self = this
    submitBefore()
    self.http.post(resource,
      params, options).then(ok => {
        submitSuccess()
        let data = ok.data.content
        let keys = []
        let basket = {};

        //collect all keys
        data.forEach(function (item) {
          for (let key in item) {
            if (!basket[key]) {
              keys.push(key)
              basket[key] = true
            }
          }
        })

        columns.push(...keys)

        data.forEach(function (item) {
          let new_item = {}
          keys.forEach(function (key) {
            new_item[key] = item[key]
          })
          tableData.push(new_item)
          // console.log(tableData)
        })
      }, notok => {
        submitFail(notok.bodyText)
      })
    return { "columns": columns, "tableData": tableData }
  }

}

export default Backend
