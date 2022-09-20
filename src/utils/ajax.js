export const ip = "http://localhost:8080";
//export const ip = "http://localhost:10001";
//export const ip = "http://192.168.1.107:8080";
//export const ip = "http://192.168.10.101:8080";

export const doFilePost = async(url, file) => {
    let formData = new FormData();
    formData.append("file", file);

    let opts = {
        method: "POST",
        body: formData,
        credentials: "include"
    };

    let response = await fetch(ip + url, opts);
    let imageURL = await response.text();
    if (imageURL !== "") imageURL = ip + imageURL;
    return imageURL;
}

export const doJSONPost = async(url, json) => {
    let opts = {
        method: "POST",
        // mode:"no-cors",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json),
        credentials: "include"
    }

    let response = await fetch(ip + url, opts);
    let responseJSON = await response.json();
    return responseJSON;
}

export const doGet = async(url) => {
    let opts = {
        method: "GET",
        headers: {
            Accept: 'application/json',
        },
        credentials: "include"
    }

    let response = await fetch(ip + url, opts);
    let responseJSON = await response.json();
    return responseJSON;
}