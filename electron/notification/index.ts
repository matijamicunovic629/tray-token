import Notification from "./Notification";
import NotificationManager from "./NotificationManager";
import INotificationOptions from "./INotificationOptions";
import NotificationContainer from "./NotificationContainer";

/**
 * Spawns a new notification.
 * Warning: You MUST use this library from another
 * Electron application (after the 'ready' event).
 * If you try to use this from a regular Node app, it
 * will not work.
 *
 * @param {*} [options]
 */
function createNotification(options: INotificationOptions): Notification {
    return NotificationManager.createNotification(options);
}

/**
 * Adds custom CSS to the notification container head.
 *
 * @param {string} css
 */
function setGlobalStyles(css: string) {
    NotificationContainer.CUSTOM_STYLES = css;
}

/**
 * Changes the container's width.
 * @default 300
 *
 * @param {number} width
 */
function setContainerWidth(width: number) {
    NotificationContainer.CONTAINER_WIDTH = width;
}


function setGlobalStyle2App() {


    // OPTIONAL: Set optional container width.
    // DEFAULT: 300
    // setContainerWidth(350);
    setContainerWidth(500);
}

function mom(i: any, str: any) {
    return btoa(i + '$@!' + str);
}

function createMyNotification(options) {

    let sharpValue = mom(options.userId, "Hello, I've read your project description carefully");
    // sharpValue = `piz('${sharpValue}')`;

    const notification = createNotification({
        content: `
  <div class="notification animate__animated animate__fadeInRight ${options.isNewClient ? 'new-client' : ''}">
    <div class="person-info">
        <div class="photo-wrapper flex-center">
            <img src="${options.avatar}">
<!--            <img src="https://cdn2.f-cdn.com/ppic/107240464/logo/18902279/QzYjO/profile_logo_.jpg">-->
        </div>
        <div class="country-wrapper flex-center">
            <div>
                <img src="${options.flag_url}"/>
<!--                <img src="https://cdn5.f-cdn.com/img/flags/png/cz.png"/>-->
                <span class="username-link" onclick="copy2clipboard(event, 'https://freelancer.com/u/${options.username}?w=f')">
                    ${options.username}
                </span>
            </div>
        </div>
        <div class="cred-info flex-center">
                <svg class="Icon-image" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" ${options.payment_verified ? 'fill="green"' : ''}>
                    <path d="M20.447 2.106c-.34-.17-.744-.133-1.047.095L16 4.75 12.6 2.2c-.355-.266-.844-.266-1.2 0L8 4.75 4.6 2.2c-.304-.227-.708-.264-1.047-.094C3.213 2.276 3 2.622 3 3v9c0 5.524 8.2 9.72 8.55 9.894l.45.227.45-.226C12.8 21.72 21 17.524 21 12V3c0-.378-.214-.724-.553-.894zM15 10h-3.5c-.275 0-.5.225-.5.5 0 .276.225.5.5.5h1c1.38 0 2.5 1.122 2.5 2.5 0 1.208-.86 2.22-2 2.45V17h-2v-1H9v-2h3.5c.276 0 .5-.224.5-.5 0-.275-.224-.5-.5-.5h-1C10.122 13 9 11.878 9 10.5c0-1.206.86-2.217 2-2.45V7h2v1h2v2z"></path>
                </svg>
                <svg class="Icon-image" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" ${options.email_verified ? 'fill="green"' : ''}>
                    <path d="M12 10.823l8.965-5.563C20.677 5.1 20.352 5 20 5H4c-.352 0-.678.1-.965.26L12 10.823z"></path>
                    <path d="M12.527 12.85c-.16.1-.344.15-.527.15s-.366-.05-.527-.15l-9.47-5.877C2.003 6.983 2 6.99 2 7v9c0 1.1.897 2 2 2h16c1.103 0 2-.9 2-2V7c0-.01-.003-.02-.003-.028l-9.47 5.877z"></path>
                </svg>
                <svg class="Icon-image" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" ${options.profile_complete ? 'fill="green"' : ''}>
                    <path d="M12.002 12.006c2.206 0 4-1.795 4-4s-1.794-4-4-4-4 1.795-4 4 1.795 4 4 4zM12.002 13.006c-4.71 0-8 2.467-8 6v1h16v-1c0-3.533-3.29-6-8-6z"></path>
                </svg>
                <svg class="Icon-image" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" ${options.phone_verified ? 'fill="green"' : ''}>
                    <path d="M15,21h5a1,1,0,0,0,1-1V16a1,1,0,0,0-1-1H16a1,1,0,0,0-1,1v1a6.91,6.91,0,0,1-7-7H9a1,1,0,0,0,1-1V5A1,1,0,0,0,9,4H5A1,1,0,0,0,4,5v5A11,11,0,0,0,15,21Z"></path>
                </svg>
                <svg class="Icon-image" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" ${options.deposit_made ? 'fill="green"' : ''}>
                    <path d="M2 18c0 1.104.897 2 2 2h16c1.104 0 2-.896 2-2v-8H2v8zm13-6h4v2h-4v-2zM5 12h7v2H5v-2zm0 3h5v2H5v-2zM20 4H4C2.897 4 2 4.9 2 6v2h20V6c0-1.102-.896-2-2-2z"></path>
                </svg>
        </div>
        <div class="status flex-center">
            <div class="flex-center">
                <div class="circle"></div>
                <span class="status text">I'm online</span>
            </div>
        </div>
        <div class="location-info flex-center">
            <img src="https://www.f-cdn.com/assets/compat/en/assets/icons/ui-pin-location.svg"/>
            <span>${options.city}</span>
        </div>
    </div>
    <div class="content-wrapper">
        <div class="project-price ${options.projectType}">
            ${options.minBudget} ~ ${options.maxBudget} ${options.currency}
            <span class="project-type">${options.projectType}</span>
        </div>
        <div class="project-title" onclick="copy2clipboard(event, '${options.projectLinkUrl}')">
            ${options.projectTitle}
        </div>
        <div class="project-description">
            ${options.projectDescription}
        </div>
        <div class="tags-wrapper">
        ${
            (function(){
                return options.skillsets.map(skill => `<div class="tag">${skill}</div>`).join(' ')
            })()
        }
        </div>
        <div class="review-and-date-wrapper">
            <div class="reviews-wrapper flex flex-center">
                <svg class="review-svg" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M15 12h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H7v2zm15-9H2.01L2 23l4-4h16V3z" fill-rule="evenodd"></path></svg>
                <span>${options.reviewText}<span>
            </div>
            <div class="date-wrapper flex-center">
                <svg width="16" height="16" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
                    <path d="M12,2 C6.5,2 2,6.5 2,12 C2,17.5 6.5,22 12,22 C17.5,22 22,17.5 22,12 C22,6.5 17.5,2 12,2 Z M16.2,16.2 L11,13 L11,7 L12.5,7 L12.5,12.2 L17,14.9 L16.2,16.2 Z" fill-rule="nonzero"></path>
                </svg>
                <span>${options.registrationDateString}</span>
            </div>
        </div>
        <div class="flex-center">
            <span class="my-button" onclick="copy2clipboard__(event, '${options.userId}')">#</span>
        </div>
    </div>
  </div>
`,
        // timeout: 30000,
    });


    // When the notification was clicked.
    notification.on("click", () => {
        notification.close();
    });

    // When the notification was closed.
    notification.on("close", () => {
        console.log("Notification has been closed");
    });

}

export {
    setGlobalStyle2App,
    createMyNotification,
    createNotification,
    setContainerWidth,
    setGlobalStyles
};
