import { IP_ADDRESS } from "../pages/constant";

export const blobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

export const blobToTranscript = async (audioURI) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", audioURI, true);
    xhr.send(null);
  });

  const audioBase64 = await blobToBase64(blob);

  const response = await fetch(`http://${IP_ADDRESS}:9000/`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: audioBase64 }),
  });
  const res = await response.json();
  console.log("resrrr ", res);
  return res;
};
