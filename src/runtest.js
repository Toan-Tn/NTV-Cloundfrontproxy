const { AdminService, CompanyService, S3Service,
  setCookieString, RESPONSE, WARN, NTVError, CloudFrontService } = require("ntv_module");

// const login = async () => {
//     let response = {};
//     try {

//         const requestJSON = {
//             username: 'admin',
//             password: 'Ssv@1234',
//         };
//         const query = {
//             ...requestJSON,
//         }
//         const data = await AdminService.login(query);
//         console.log(data);
//         const { token } = data.payload;
//         const options = {
//             domain: 'qr-ux.com',
//             sameSite: 'Strict'
//         }
//         const cookieString = setCookieString("token", token, options);
//         response = RESPONSE(data, {
//             'Set-Cookie': cookieString,
//         });
//     } catch (err) {
//         console.error('error: ', err);
//         response = RESPONSE(WARN("Internal Server Error"));
//         if (err instanceof NTVError) {
//             response = RESPONSE(WARN(err.message, err.payload, err.code));
//         }
//     }
//     return response;
// };

// login().then((res) => {
//     console.log(res);
// });

// const createUser = async () => {
//     let response = {};
//     try {

//         const requestJSON = {
//             username: 'admin',
//             password: 'Ssv@1234',
//             type: 9,
//             name: 'Administrator',
//         };
//         const query = {
//             ...requestJSON,
//         }
//         const data = await AdminService.create(query);
//         console.log(data);
//     } catch (err) {
//         console.error('error: ', err);
//         response = RESPONSE(WARN("Internal Server Error"));
//         if (err instanceof NTVError) {
//             response = RESPONSE(WARN(err.message, err.payload, err.code));
//         }
//     }
//     return response;
// }
// createUser();

// const createCompany = async () => {
//     let response = {};
//     try {

//         const requestJSON = {
//             companycode: 'A0000002',
//             mail: 'vn@saisshunkansys.com',
//             name: 'Saishunkan System Vietnam',
//             adminuser: 'ssv',
//             adminpassword: 'Ssv@1234',
//             adminmail: 'vn@saisshunkansys.com',
//             adminname: 'Administrator'
//         };
//         const query = {
//             ...requestJSON,
//         }
//         const data = await CompanyService.createCompany(query);
//         console.log(data);
//     } catch (err) {
//         console.error('error: ', err);
//         response = RESPONSE(WARN("Internal Server Error"));
//         if (err instanceof NTVError) {
//             response = RESPONSE(WARN(err.message, err.payload, err.code));
//         }
//     }
//     return response;
// }
// createCompany();

// const loginCompany = async () => {
//   let response = {};
//   try {

//       const requestJSON = {
//           companycode: 'A0000002',
//           username: 'ssv',
//           password: 'Ssv@1234',
//       };
//       const query = {
//           ...requestJSON,
//       }
//       const data = await CompanyService.login(query);
//       console.log(data);
//   } catch (err) {
//       console.error('error: ', err);
//       response = RESPONSE(WARN("Internal Server Error"));
//       if (err instanceof NTVError) {
//           response = RESPONSE(WARN(err.message, err.payload, err.code));
//       }
//   }
//   return response;
// }
// loginCompany();

// const makePresignUpload = async () => {
//   let response = {};
//   try {

//     const requestJSON = {
//       "file": "Pha xử lý IQ 1000 của LongKhatMau.mp4",
//       "md5hash": "03245FB1FF62405A362215F0AE9F46C0"
//     };
//     const query = {
//       ...requestJSON,
//     }
//     const user = {
//       "companycode": "A0000002",
//       "mail": "vn@saisshunkansys.com",
//       "username": "ssv",
//       "name": "Administrator",
//       "type": 9,
//       "iat": 1640600781,
//       "exp": 1641205581
//     }
//     const data = await S3Service.makePresignUpload(user, query);
//     console.log(data);
//   } catch (err) {
//     console.error('error: ', err);
//     response = RESPONSE(WARN("Internal Server Error"));
//     if (err instanceof NTVError) {
//       response = RESPONSE(WARN(err.message, err.payload, err.code));
//     }
//   }
//   return response;
// }
// makePresignUpload();

// const mediaConvertFile = async () => {
//   let response = {};
//   try {

//     const requestJSON = {
//       "s3SchemaVersion": "1.0",
//       "configurationId": "483b47a8-865e-4c11-935b-66e01fdac310",
//       "bucket": {
//         "name": "ntvlibrary-20211227",
//         "ownerIdentity": {
//           "principalId": "AY7FBTGGEOPOM"
//         },
//         "arn": "arn:aws:s3:::ntvlibrary-20211227"
//       },
//       "object": {
//         "key": "source/A0000002/20211227/N00shDEREwiid9RN.mp4",
//         "size": 17866480,
//         "eTag": "03245fb1ff62405a362215f0ae9f46c0",
//         "sequencer": "0061C9A41316902BD3"
//       }
//     };
//     const query = {
//       ...requestJSON,
//     }
//     const data = await S3Service.mediaConvertFile(query);
//     console.log(data);
//   } catch (err) {
//     console.error('error: ', err);
//     response = RESPONSE(WARN("Internal Server Error"));
//     if (err instanceof NTVError) {
//       response = RESPONSE(WARN(err.message, err.payload, err.code));
//     }
//   }
//   return response;
// }
// mediaConvertFile();

const makeSigned = async () => {
  let response = {};
  try {

    const user = {
      "companycode": "A0000002",
      "mail": "vn@saisshunkansys.com",
      "username": "ssv",
      "name": "Administrator",
      "type": 9,
      "iat": 1640600781,
      "exp": 1641205581
    }
    const query = {
      filepath: 'A0000002/20211227/N00shDEREwiid9RN/'
    }
    const data = await CloudFrontService.makeSigned(user, query);
    console.log(data);
  } catch (err) {
    console.error('error: ', err);
    response = RESPONSE(WARN("Internal Server Error"));
    if (err instanceof NTVError) {
      response = RESPONSE(WARN(err.message, err.payload, err.code));
    }
  }
  return response;
}
makeSigned();
