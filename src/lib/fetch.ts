import { ExtensionCard, FullExtensionInfo } from './extension';

const EXTENSIONS_LIST_URL = '/pool/Release.json'
const EXTENSIONS_INFO_URL = '/pool/{id}/rubisco.json'

export async function fetchExtensions(baseUrl: string): Promise<ExtensionCard[]> {
    const response = await fetch(baseUrl + EXTENSIONS_LIST_URL);
    const responseData = await response.json();
    const data = responseData["pool"];
    const res: ExtensionCard[] = [];
    for (const item of new Map(Object.entries(data))) {
        const extinfo: any = item[1];
        extinfo.id = item[0];
        const extension = ExtensionCard.fromJSON(extinfo);
        res.push(extension);
    }
    return res;
}

export async function fetchExtensionInfo(baseUrl: string, id: string): Promise<FullExtensionInfo | null> {

    const response = await fetch(baseUrl + EXTENSIONS_INFO_URL.replace("{id}", id));
    if (response.status === 404) {
        return null;
    }
    const responseData = await response.json();
    responseData.id = id;
    const extinfo = FullExtensionInfo.fromJSON(responseData);
    extinfo.id = id;
    return extinfo;
}
