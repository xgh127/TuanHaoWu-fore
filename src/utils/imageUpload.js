import { doFilePost } from "./ajax"

export async function imageUpload(file) {
    let imageURL = await doFilePost("/doUpload", file);
    if (imageURL == "") imageUploadFail();

    return {
        url: imageURL,
    }
    // return {
    //     url: URL.createObjectURL(file),
    // }
}

export function imageUploadFail() {
    throw new Error('Fail to upload')
}