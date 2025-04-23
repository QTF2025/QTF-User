import CryptoJS from "crypto-js";
import localStoreData from "./localstorage";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

export const aesEncrypt = (token: string) => {
  const decodedHeader: any = jwtDecode(token);
  const decryptData2 = (data: any) => {
    var C = CryptoJS;
    var Key = C.enc.Utf8.parse("THisIScuT0mEncK3yForDat8$ecurity");
    var IV = C.enc.Utf8.parse("THisIScuT0mEncK3");
    var decryptedText = C.AES.decrypt(data, Key, {
      iv: IV,
      mode: C.mode.CBC,
      padding: C.pad.Pkcs7,
    });
    return decryptedText.toString(C.enc.Utf8);
  };
  const userData = JSON.parse(decryptData2(decodedHeader?.key))
    ? JSON.parse(decryptData2(decodedHeader?.key))
    : {};

  localStoreData.setUserData(userData);

  return userData;
};

export const convertToDate = (date: any) => {
  return dayjs(new Date(date.$d)).format("YYYY-MM-DD");
};

export const convertToDateYear = (date: any) => {
  return dayjs(new Date(date.$d)).format("YYYY");
};

const isValidData = async (obj: any, keysToCheck: any) => {
  let keys = Object.keys(obj);

  return new Promise((resolve, reject) => {
    keys.forEach((key) => {
      if (keysToCheck.includes(key)) {
        switch (true) {
          case obj[key] === "":
            resolve(false);
            break;
          case obj[key] === null:
            console.log("ss", obj[key]);
            resolve(false);
            break;
          case obj[key] === undefined:
            console.log("ss1", obj[key]);
            resolve(false);
            break;
          default:
            resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  });
};

export const isEmptyKeys1 = async (
  dataObj: any,
  type: string,
  validateKeys: string[]
) => {
  const keys = Object.keys(dataObj);

  switch (type) {
    case "EMPTY_STRING":
      return !keys.some((key: any) => {
        if (validateKeys.includes(key)) {
          return dataObj[key] === "";
        } else {
          return true;
        }
      });
    case "UNDEFINED":
      return !keys.some((key: any) => {
        if (validateKeys.includes(key)) {
          return dataObj[key] === undefined;
        } else {
          return true;
        }
      });
    case "ALL":
      return await isValidData(dataObj, validateKeys)
    default:
      return true;
  }
};

export const isEmptyKeys = (
  dataObj: any,
  type: string,
  notValidate: string[]
) => {
  const keys = Object.keys(dataObj);

  switch (type) {
    case "EMPTY_STRING":
      return !keys.some((key: any) => {
        if (!notValidate.includes(key)) {
          return dataObj[key] === "";
        } else {
          return true;
        }
      });
    case "UNDEFINED":
      return !keys.some((key: any) => {
        if (!notValidate.includes(key)) {
          return dataObj[key] === undefined;
        } else {
          return true;
        }
      });
    case "ALL":
      return !keys.some((key: any) => {
        if (!notValidate.includes(key)) {
          return (
            dataObj[key] === "" ||
            dataObj[key] === null ||
            dataObj[key] === undefined
          );
        } else {
          return true;
        }
      });
    default:
      return true;
  }
};

export const generateTaxYearMonth = () => {
    const month = new Date().getMonth()
    if(month > 2){
        return true;
    }else{
        return false;
    }
}


export const downloadFile = (url: string) => {
  const a = window.document.createElement('a')
  a.href = url;
  window.document.body.appendChild(a)
  a.click()
  window.document.body.removeChild(a)
}

export  const getLeadStatus = (id: any) => {
    let status;
    switch(id) {
      case '1':
          status = "Process"
        return status;
      case '2':
          status = "Preparation"
        return status;
      case '3':
          status = "Review"
        return status;
      case '4':
          status = "Finance"
        return status;
      case '6':
          status = "Submission"
        return status;
      case '7':
          status = "Completed"
        return status;
      default:
        return '';
    }
  }

  export const fileNames = (arr:any) => {
    const newstr =  arr?.replaceAll('//uploads','/uploads');
    const urlArray = newstr.split(',');
    return urlArray.map((url:any) => {
        const segments = url.split('/');
        const fileName = segments[segments.length - 1];
        return (
            <span key={fileName} style={{ marginRight: '10px' }}>
            <a href={url} target="_blank" rel="noopener noreferrer" key={fileName}>
                {fileName}
            </a>
            </span>
        );
    });
};