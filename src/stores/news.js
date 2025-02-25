import { computed, ref } from "vue"
import { defineStore } from "pinia"
export const useNews = defineStore('news', () => {
    const list = [
        {
            image: "news-1.jpg",
            title: `O'zbekiston bo'ylab "Yangi Nafas" marafonini nishonlash o'zgacha ruhda..`,
            text: `Ayni paytda mamlakatimizning 16 shahrida "Yangi nafas" umumxalq poyga marafoni bo'lib o'tmoqda.`,
            date: "25.11.2023",
            views: 145,
        },
        {
            image: "news-2.jpg",
            title: "Qabul qilish munosabati bilan bayram tadbiri o'tkazildi.",
            text: "Tadbir davomida universitet talabalari kengashida Prezident inauguratsiyasi marosimi ham bo'lib o'tdi.",
            date: "24.11.2023",
            views: 70,
        },
        {
            image: "news-3.jpg",
            title: "Yangi O'zbekiston universitetida klublar kuni bo'lib o'tdi.",
            text: "Qayd etilgan klublar kunida Yangi O'zbekiston universitetida mavjud barcha to'garaklar o'z dasturlarini namoyish etib, talabalarga qanday...",
            date: "22.11.2023",
            views: 15,
        },
        {
            image: "news-4.jpg",
            title: "Saksoniya delegatsiyasi bilan hamkorlikdagi munozaralar Yangi...",
            text: "Bugun Yangi O'zbekiston universitetida Saksoniya fan vaziri Sebastyan boshchiligidagi delegatsiya bilan uchrashuv bo'lib o'tdi...",
            date: "18.11.2023",
            views: 36,
        },
        {
            image: "news-1.jpg",
            title: `O'zbekiston bo'ylab "Yangi Nafas" marafonini nishonlash o'zgacha ruhda..`,
            text: `Ayni paytda mamlakatimizning 16 shahrida "Yangi nafas" umumxalq poyga marafoni bo'lib o'tmoqda.`,
            date: "25.11.2023",
            views: 145,
        },
        {
            image: "news-2.jpg",
            title: "Qabul qilish munosabati bilan bayram tadbiri o'tkazildi.",
            text: "Tadbir davomida universitet talabalari kengashida Prezident inauguratsiyasi marosimi ham bo'lib o'tdi.",
            date: "24.11.2023",
            views: 70,
        },
        {
            image: "news-3.jpg",
            title: "Yangi O'zbekiston universitetida klublar kuni bo'lib o'tdi.",
            text: "Qayd etilgan klublar kunida Yangi O'zbekiston universitetida mavjud barcha to'garaklar o'z dasturlarini namoyish etib, talabalarga qanday...",
            date: "22.11.2023",
            views: 15,
        },
        {
            image: "news-4.jpg",
            title: "Saksoniya delegatsiyasi bilan hamkorlikdagi munozaralar Yangi...",
            text: "Bugun Yangi O'zbekiston universitetida Saksoniya fan vaziri Sebastyan boshchiligidagi delegatsiya bilan uchrashuv bo'lib o'tdi...",
            date: "18.11.2023",
            views: 36,
        },
    ];


    const homeNews = computed(() => {
        const result = list.slice(0, 4);
        console.log(result, 'toxa')
        return result
    })






    return { list, homeNews }
})