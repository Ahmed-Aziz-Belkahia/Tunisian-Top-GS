function goBack() {
    window.history.back();
}

function showLinkPopup() {
    const modal = document.getElementById("linkPopup");
    const url = window.location.href;
    document.getElementById("urlLink").value = url;
    modal.style.display = "block";
}

function closeLinkPopup() {
    document.getElementById("linkPopup").style.display = "none";
}

function copyLink() {
    const urlLink = document.getElementById("urlLink");
    urlLink.select();
    document.execCommand("copy");
    urlLink.value = "Link copied!";
    setTimeout(() => {
        urlLink.value = window.location.href;
    }, 2000);
}

function captureUserProfile() {
    const userProfileContainer = document.getElementById('userProfileContainer');
    if (userProfileContainer) {
        const originalBackgroundColor = getComputedStyle(userProfileContainer).backgroundColor;

        // Temporarily set a #201654 background for the capture
        userProfileContainer.style.backgroundColor = "#201654";

        html2canvas(userProfileContainer).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'user-profile.png';
            link.click();

            // Restore the original background after capture
            userProfileContainer.style.backgroundColor = originalBackgroundColor;
        });
    }
}
