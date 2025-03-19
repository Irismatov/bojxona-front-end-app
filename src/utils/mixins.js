export function getBlobUrl(base64Data) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
}


export function formatISO8601(ISO8601) {
    const date = new Date(ISO8601);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

export function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // UNIX timestamp sekund formatida keladi

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Oy 0 dan boshlanadi
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} --- ${hours}:${minutes}`;
}

export function startTimer(unixTime) {
    setInterval(() => {
        const minutes = calculateMinutesFromUnixTimestamp(unixTime);
        console.log(`Hozirgacha o'tgan daqiqalar: ${minutes}`);
    }, 60000); // Har 1 daqiqada yangilanadi
}

const calculateTimePassed = (unixTimestamp) => {
    if (!unixTimestamp) return { minutes: 0, seconds: 0 };

    const startDate = new Date(unixTimestamp * 1000); // UNIX timestampni millisekundga aylantirish
    const now = new Date();
    const timeDifferenceMs = now - startDate;

    const minutes = Math.floor(timeDifferenceMs / 60000); // Daqiqalarga aylantirish
    const seconds = Math.floor((timeDifferenceMs % 60000) / 1000); // Sekundlarga aylantirish

    return formatTime(minutes, seconds);
};



const formatTime = (minutes, seconds) => {
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};