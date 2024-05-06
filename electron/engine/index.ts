// @ts-ignore
import SockJS from 'sockjs-client';
import {extractNecessaryDataFromMessage, getNecessaryInfosByUserId} from "./apis";
import {createMyNotification} from "../notification";
import notification from "../notification/Notification";

let sock: any = null;
let mapProjectLink: any = {};

const checkNewClientProject = (notificationOption) => {

    if (notificationOption.country === 'India' ||
        notificationOption.country === 'Pakistan' ||
        notificationOption.country === 'Bangladesh')
        return false;

    if (notificationOption.projectType === 'hourly' &&
        notificationOption.maxBudget > 0 &&
        notificationOption.maxBudget < 15)
        return false;


    if (notificationOption.projectType === 'fixed' &&
        notificationOption.minBudget < 250)
        return false;

    // registrationDate > 1000
    if (Date.now() - notificationOption.registrationDate.getTime() > 864000000)
        return false;

    notificationOption.isNewClient = true;
    return true;
}

const checkProject = (notificationOption) => {

    if (mapProjectLink[notificationOption.projectLinkUrl]) // stop duplication
        return false;

    mapProjectLink[notificationOption.projectLinkUrl] = true;

    // country filter
    if (notificationOption.country === 'India' ||
        notificationOption.country === 'Pakistan' ||
        notificationOption.country === 'Bangladesh')
        return false;

    if (notificationOption.isFreelancer)
        return true;

    return false;

/*
    // verified filter
    if (!notificationOption.payment_verified /!*||
        !notificationOption.deposit_made*!/)
        return false;

    // price filter
    if (notificationOption.projectType === 'hourly' &&
        notificationOption.maxBudget > 0 &&
        notificationOption.maxBudget < 15)
        return false;

    if (notificationOption.projectType === 'fixed' &&
        notificationOption.maxBudget < 150
    )
        return false;

    // review filter
    if (notificationOption.reviewCount > 50)
        return false;

    // check submitted time
    if (Date.now() - notificationOption.timeSubmitted * 1000 > 600000)
        return false;

    // check review
    if (notificationOption.isPoorClient)
        return false;
*/

    return true;
}

const handleProject = async (projectData) => {

    const userId = projectData.userId;
    const data = await getNecessaryInfosByUserId(userId);
    const exractedData = extractNecessaryDataFromMessage(projectData);
    console.log("__________________________")
    const notificationOption = {
        ...data,
        ...exractedData
    };
    console.log(notificationOption)
    console.log("__________________________")
    if (checkProject(notificationOption)/* || checkNewClientProject(notificationOption)*/) {
        createMyNotification(notificationOption);
    }
}

const initSockJS = () => {

    const requestArray = [
        `{"channel":"auth","body":{"hash2":"YHYZMEcVNy1K7ZtGFyEqv3v96pk1vRkAGP7R41QIeGk=","user_id":75346685}}`,
        `{"channel":"onlineoffline","body":{"route":"getsub","users":[]}}`,
        `{"channel":"channels","body":{"channels":[3,6,7,9,13,15,51,59,77,92,106,113,116,147,237,335,343,500,598,669,704,759,979,1092,1119,1126,2370,2372,2376,2397,2630,2631,2632]}}`
    ];

    sock = new SockJS("https://notifications.freelancer.com");

    sock.onopen = (e) => {
        console.log("socket onOpen", e);

        for(let i = 0; i < requestArray.length; i ++) {
            sock.send(requestArray[i]);
        }
    };

    sock.onclose = (e) => {
        console.log("socket onClose", e);

        setTimeout(() => {
            console.log("Attempting to reconnect...");
            initSockJS();
        }, 2000);
    };

    sock.onmessage = (e) => {
        console.log("onMessage", e);
        try {

            const message = JSON.parse(e.data);
            if (message.channel === 'user' && message.body.type === 'project') {
                handleProject(message.body.data);
            }

        } catch(e) {

        }
    };

    sock.onerror = (e) => {
        console.log("socket onError", e);
    };

}

export const runEngine = () => {

    initSockJS();

}
