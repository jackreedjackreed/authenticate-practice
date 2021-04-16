import React, { Component } from 'react';
import axios from 'axios';
// import { generateUploadURL } from '../../../backend/s3'
// import { UploadURL } from '../../../backend/s3'


export default class Uploader extends Component {
  state = {
    message:''
  };

  getImage = e => {
    const files = e.target.files;
    console.log(files)
    console.log(files[0])
    if (files && files.length > 0) {
      const file = files[0];
      this.setState({ file });
      console.log("got the image")
    }
    // const file = e.target.file
    // this.setState({file});
    // console.log("got the file and set that state")


  };

  uploadFile = e => {
    e.preventDefault();
    const { file } = this.state;
    this.setState({message:'Uploading...'})
    const contentType = file.type; // eg. image/jpeg or image/svg+xml

    const generatePutUrl = 'http://localhost:4000/generate-put-url';
    const options = {
      params: {
        Key: file.name,
        ContentType: contentType
      },
      headers: {
        'Content-Type': contentType
      }
    };

    axios.get(generatePutUrl, options).then(res => {
      const {
        data: { putURL }
      } = res;
      axios
        .put(putURL, file, options)
        .then(res => {
          this.setState({message:'Upload Successful'})
          setTimeout(()=>{
            this.setState({message:''});
            document.querySelector('#upload-image').value='';
          }, 2000)
        })
        .catch(err => {
          this.setState({message:'Sorry, something went wrong'})
          console.log('err', err);
        });
    });
  };


    // uploadFile = e => {
    //     e.preventDefault();
    //     const files = e.target.files;
    //     console.log(files)
    //     console.log(files[0])
    //     const file = files[0]

    //     // get secure url from the server
    //     console.log(UploadURL);

    //     //apost the image directly to the s3 bucket
    //     // axios
    //     // .put(
            
    //     // ) fetch(url, {
    //     //     method: "PUT",
    //     //     headers: {
    //     //         "Content-Type": "multipart/form-data"
    //     //     },
    //     //     body: file
    //     // });

    //     const imageURL = url.split('?')[0]
    //     console.log(imageURL)
    // }


  render() {
    return (
      <React.Fragment>
        <h1>Upload an image to AWS S3 bucket</h1>
        <input
          id='upload-image'
          type='file'
          accept='image/*'
          onChange={this.getImage}
        />
        {/* <p>{this.state.message}</p> */}
        <form onSubmit={this.uploadFile}>
          <button id='file-upload-button'>Upload</button>
        </form>
      </React.Fragment>
    );
  }
}