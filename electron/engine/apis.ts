const baseURL = 'https://freelancer.com'
export const getUserProfile = (userId: number) => {

    return new Promise((resolve, reject) => {
        fetch(`https://www.freelancer.com/api/users/0.1/users?avatar=true&badge_details=true&country_details=true&display_info=true&employer_reputation=true&jobs=true&location_details=true&membership_details=true&preferred_details=true&qualification_details=true&responsiveness=true&reputation=true&sanction_details=true&status=true&users%5B%5D=${userId}&profile_description=true&shareholder_details=true&rising_star=true&webapp=1&compact=true&new_errors=true&new_pools=true`, {
            "headers": {
                "accept": "application/json, text/plain, */*"
            },
            "method": "GET"
        }).then(r => r.json()).then(r => resolve(r.result));
    })
}

export const getUserReviews = (userId: number) => {
    return new Promise((resolve, reject) => {
        fetch(`https://www.freelancer.com/api/projects/0.1/reviews/?compact=true&contest_details=true&contest_job_details=true&limit=6&project_details=true&project_job_details=true&review_types%5B%5D=project&review_types%5B%5D=contest&role=employer&to_users%5B%5D=${userId}&user_avatar=true&user_country_details=true&user_details=true`, {
            "headers": {
                "accept": "application/json, text/plain, */*"
            },
            "method": "GET"
        }).then(r => r.json()).then(r => resolve(r.result));
    });
}


export const getNecessaryInfosByUserId = async (userId: number) => {
    const userProfileResponse = await getUserProfile(userId);
    const userReviewsResponse = await getUserReviews(userId);

    if (!userProfileResponse.users || !userProfileResponse.users[userId])
        return;

    const userProfile = userProfileResponse.users[userId];

    let minReviewAmount = 100000000, maxReviewAmount = 0;
    if (userReviewsResponse.reviews) {
        userReviewsResponse.reviews.forEach(review => {
            if (review.currency.sign === '€' ||
                review.currency.sign === '$' ||
                review.currency.sign === '£'
            ) {
                minReviewAmount = Math.min(review.paid_amount, minReviewAmount);
                maxReviewAmount = Math.max(review.paid_amount, maxReviewAmount);
            }
        });
    }

    let isPoorClient = false;
    // userProfile.online_offline_status.status
    let reviewText = userProfile.employer_reputation.entire_history.reviews ? userProfile.employer_reputation.entire_history.reviews : "No Reviews";
    if (minReviewAmount != 100000000 && maxReviewAmount != 0) {
        if (minReviewAmount === maxReviewAmount) {
            reviewText += `(${minReviewAmount})`;
        } else {
            reviewText += `(${minReviewAmount}$ - ${maxReviewAmount}$)`;
        }

        if (maxReviewAmount < 100)
            isPoorClient = true;
    }

    const registrationDate = new Date(userProfile.registration_date * 1000);

    return {
        userId,
        isPoorClient,
        isFreelancer: userProfile.jobs && userProfile.jobs.length > 0,
        avatar: 'https:' + userProfile.avatar_cdn,
        city: userProfile.location.city,
        flag_url: 'https:' + userProfile.location.country.flag_url_cdn,
        country: userProfile.location.country.name,
        currency: userProfile.primary_currency.code,
        username: userProfile.username,
        reviewCount: userProfile.employer_reputation.entire_history.reviews ? userProfile.employer_reputation.entire_history.reviews : 0,
        reviewText,
        registrationDate,
        registrationDateString: `${registrationDate.getFullYear()}/${(registrationDate.getMonth() + 1)}/${registrationDate.getDate()}`,
        custom_charge_verified: userProfile.status.custom_charge_verified,
        deposit_made: userProfile.status.deposit_made,
        email_verified: userProfile.status.email_verified,
        facebook_connected: userProfile.status.facebook_connected,
        freelancer_verified_user: userProfile.status.freelancer_verified_user,
        identity_verified: userProfile.status.identity_verified,
        linkedin_connected: userProfile.status.linkedin_connected,
        payment_verified: userProfile.status.payment_verified,
        phone_verified: userProfile.status.phone_verified,
        profile_complete: userProfile.status.profile_complete,
        isNewClient: false
    }
}

export const extractNecessaryDataFromMessage = (projectData) => {
    return {
        projectTitle: projectData.title,
        projectDescription: projectData.appended_descr,
        skillsets: projectData.jobs_details.map(detail => detail.name),
        projectLinkUrl: baseURL + projectData.linkUrl,
        maxBudget: projectData.maxbudget,
        minBudget: projectData.minbudget,
        projectType: projectData.type,
        timeSubmitted: projectData.time_submitted
    }
}
