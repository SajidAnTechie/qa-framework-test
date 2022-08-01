function mockStartTest() {
  return {
    status: 'queue'
  }
}

function mockRefresh() {
  return {
    results: [
      {
        testCase: { rowNumber: 2 },
        status: "Pass",
        errorMessage: "",
        timeTaken: 5,
        screenshot: "https://thumbs.dreamstime.com/z/puppy-holding-blank-construction-sign-funny-cute-puppy-dog-holding-up-blank-yellow-under-construction-warning-sign-wearing-helmet-143098767.jpg"
      },
      // {
      //   testCase: {rowNumber: 3},
      //   status: "Pass",
      //   errorMessage: "",
      //   timeTaken: 5,
      //   screenshot: "https://thumbs.dreamstime.com/z/puppy-holding-blank-construction-sign-funny-cute-puppy-dog-holding-up-blank-yellow-under-construction-warning-sign-wearing-helmet-143098767.jpg"
      // },
      // {
      //   testCase: {rowNumber: 4},
      //   status: "Pass",
      //   errorMessage: "",
      //   timeTaken: 5,
      //   screenshot: "https://thumbs.dreamstime.com/z/puppy-holding-blank-construction-sign-funny-cute-puppy-dog-holding-up-blank-yellow-under-construction-warning-sign-wearing-helmet-143098767.jpg"
      // },
      // {
      //   testCase: {rowNumber: 5},
      //   status: "Pass",
      //   errorMessage: "",
      //   timeTaken: 5,
      //   screenshot: "https://thumbs.dreamstime.com/z/puppy-holding-blank-construction-sign-funny-cute-puppy-dog-holding-up-blank-yellow-under-construction-warning-sign-wearing-helmet-143098767.jpg"
      // },
      // {
      //   testCase: {rowNumber: 6},
      //   status: "Pass",
      //   errorMessage: "",
      //   timeTaken: 5,
      //   screenshot: "https://thumbs.dreamstime.com/z/puppy-holding-blank-construction-sign-funny-cute-puppy-dog-holding-up-blank-yellow-under-construction-warning-sign-wearing-helmet-143098767.jpg"
      // },
      {
        testCase: { rowNumber: 7 },
        status: "Fail",
        errorMessage: "",
        timeTaken: 5,
        screenshot: "https://thumbs.dreamstime.com/z/puppy-holding-blank-construction-sign-funny-cute-puppy-dog-holding-up-blank-yellow-under-construction-warning-sign-wearing-helmet-143098767.jpg"
      },
      {
        testCase: { rowNumber: 8 },
        status: "Fail",
        errorMessage: "",
        timeTaken: 5,
        screenshot: "https://thumbs.dreamstime.com/z/puppy-holding-blank-construction-sign-funny-cute-puppy-dog-holding-up-blank-yellow-under-construction-warning-sign-wearing-helmet-143098767.jpg"
      }
    ]
  }
}
