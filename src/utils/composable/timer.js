import { reactive, toRaw } from "vue";

export function useTimer() {
    const timers = reactive({});


    const calculateTimePassed = (unixTimestamp) => {
        if (!unixTimestamp) return { minutes: 0, seconds: 0 };

        const startDate = new Date(unixTimestamp * 1000);
        const timeDifferenceMs = now - startDate;

        const minutes = Math.floor(timeDifferenceMs / 60000);
        const seconds = Math.floor((timeDifferenceMs % 60000) / 1000);

        return { minutes, seconds };
    };

    const formatTime = (minutes, seconds) => {
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    const updateTimers = (list) => {
        console.log(list)
        Array.from(list).forEach(item => {
            console.log(item.name);
        });

        toRaw(list).forEach(item => {
            console.log("wrokdng")
            if (item.receivedAt) {
                const time = calculateTimePassed(item.receivedAt);
                timers[item.declId] = formatTime(time.minutes, time.seconds);
            }
        });
    };


    return {
        timers,
        calculateTimePassed,
        formatTime,
        updateTimers
    }

}