import { useEffect, useState } from "react";
import Logo from './assets/logo.jpg'

function App() {
  useEffect(() => {
    let script;
    let map;
    let placemark;

    const initMap = () => {
      if (!window.ymaps) return;

      window.ymaps.ready(() => {
        const mapContainer = document.getElementById("map");
        if (!mapContainer) return;

        // Xarita yaratamiz
        map = new window.ymaps.Map("map", {
          center: [55.751244, 37.618423],
          zoom: 14,
          controls: []
        });

        // SuggestView inputga biriktiramiz
        const input = document.getElementById("adress1");
        if (input) {
          const suggestView = new window.ymaps.SuggestView("adress1");

          // foydalanuvchi variantni tanlaganda
          suggestView.events.add("select", (e) => {
            const selected = e.get("item").value;
            if (selected) {
              findAddress(selected);
            }
          });
        }

        // manzilni topish funksiyasi
        const findAddress = (address) => {
          if (!address || !address.trim()) return;

          window.ymaps.geocode(address, { results: 1 }).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            if (!firstGeoObject) return;

            const coords = firstGeoObject.geometry.getCoordinates();
            const name = firstGeoObject.getAddressLine();

            if (placemark) {
              map.geoObjects.remove(placemark);
            }

            placemark = new window.ymaps.Placemark(
              coords,
              { balloonContent: name },
              { preset: "islands#redIcon" }
            );

            map.geoObjects.add(placemark);
            map.setCenter(coords, 16);
          });
        };
      });
    };

    // Yandex script yuklash
    if (!document.querySelector('script[src*="api-maps.yandex.ru/2.1/"]')) {
      script = document.createElement("script");
      script.src =
        "https://api-maps.yandex.ru/2.1/?apikey=d8d80a96-bfba-4810-baaf-e4a249cb1729&lang=ru_RU";
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      if (window.ymaps) initMap();
    }

    // cleanup
    return () => {
      if (map) {
        map.destroy();
        map = null;
      }
    };
  }, []);

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [activeTab, setActiveTab] = useState("now");


  return (
    <>
      <header className="relative z-10 bg-[#252525] py-3.5 lg:py-2.5 px-5">
        <a className="flex items-center text-white text-2xl md:text-4xl lg:text-6xl w-fit lg:h-17.5" href="#">
          <img
            className="h-7.5 lg:h-11"
            src={Logo}
            alt="Logo" />
        </a>
      </header>


      {/* Accourdions */}
      <div className="w-full md:max-w-142.5 lg:max-w-170 relative z-10 md:px-5 pt-10 md:py-10">
        <div className=" w-full">

          {/* 1  */}
          <div className="bg-white rounded-[20px] p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-5 bg-black text-white text-xs flex items-center justify-center rounded-full">
                1
              </div>
              <h2 className="font-bold text-[22px]">
                Откуда
              </h2>
            </div>

            {/* Адрeс */}
            <div className="mb-4 flex max-md:flex-col gap-3 md:gap-5 justify-between">
              <p className="text-black font-medium">Адрeс</p>

              <input
                type="text"
                name="adress"
                id="adress"
                className="font-medium w-full md:max-w-90 lg:max-w-115 bg-[#EEEEEE] rounded-[10px] outline-none max-md:!py-2.5 p-4.5"
                defaultValue={'Орехово-Зуево, ул. Ленина, 15'}
                readOnly />
            </div>

            {/* Отпрaвитeль */}
            <div className="mb-4 flex max-md:flex-col gap-3 md:gap-5 justify-between">
              <div>
                <p className="text-black font-medium">Отпрaвитeль</p>
                <button
                  onClick={() => toggleAccordion(1)}
                  className="flex items-center gap-2">
                  <span className="text-[13px] text-[#0668BE]">Дeтaли</span>
                  <svg
                    className={`transition-transform duration-300 ${openIndex === 1 ? "-rotate-90" : "rotate-0"
                      }`}
                    width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.08044 0.252912C1.01477 0.318442 0.962678 0.39628 0.927133 0.48197C0.891587 0.567659 0.873291 0.659518 0.873291 0.752287C0.873291 0.845056 0.891587 0.936915 0.927133 1.0226C0.962678 1.10829 1.01477 1.18613 1.08044 1.25166L3.82877 4L1.08044 6.74833C1.01486 6.81391 0.96284 6.89176 0.927349 6.97744C0.891858 7.06313 0.873591 7.15496 0.873591 7.2477C0.873591 7.34045 0.891858 7.43228 0.927349 7.51796C0.96284 7.60365 1.01486 7.6815 1.08044 7.74708C1.14602 7.81266 1.22387 7.86468 1.30955 7.90017C1.39524 7.93566 1.48707 7.95393 1.57981 7.95393C1.67256 7.95393 1.76439 7.93566 1.85007 7.90017C1.93576 7.86468 2.01361 7.81266 2.07919 7.74708L5.33044 4.49583C5.3961 4.4303 5.4482 4.35246 5.48375 4.26677C5.51929 4.18108 5.53759 4.08922 5.53759 3.99645C5.53759 3.90368 5.51929 3.81183 5.48375 3.72614C5.4482 3.64045 5.3961 3.56261 5.33044 3.49708L2.07919 0.245828C1.81002 -0.0233382 1.35669 -0.023338 1.08044 0.252912Z" fill="#0668BE" />
                  </svg>
                </button>
              </div>

              <div className="w-full md:max-w-90 lg:max-w-115 space-y-2.5">
                <input
                  type="text"
                  name="adress"
                  id="adress"
                  className="font-medium w-full bg-[#EEEEEE] rounded-[10px] outline-none max-md:!py-2.5 p-4.5"
                  defaultValue={'+79824627098'}
                  readOnly />
                {/* Acourdion Contern */}
                {openIndex === 1 && (
                  <div className="relative z-0 pt-1.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative bg-[#fafafa]">
                        <input
                          type="text"
                          id="small_standard"
                          className="uppercase font-medium block w-full px-0 py-3 max-md:text-sm text-[#545454] bg-transparent border-b border-[#9E9B98] appearance-none  focus:outline-none focus:ring-0 peer"
                          placeholder=" "
                          defaultValue={'Aнoxин'}
                          readOnly />
                        <label
                          for="small_standard"
                          className="absolute text-sm text-[#9e9b98] duration-300 transform -translate-y-4 top-3 z-0 origin-[0] peer-focus:start-0 peer-placeholder-shown:translate-y-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                        >
                          Имя
                        </label>
                      </div>
                      {/* Анaтолий */}
                      <div className="relative bg-[#fafafa]">
                        <input
                          type="text"
                          id="small_standard"
                          className="uppercase font-medium block w-full px-0 py-3 max-md:text-sm text-[#545454] bg-transparent border-b border-[#9E9B98] appearance-none  focus:outline-none focus:ring-0 peer"
                          placeholder=" "
                          defaultValue={'Анaтолий'}
                          readOnly />
                        <label
                          for="small_standard"
                          className="absolute text-sm text-[#9e9b98] duration-300 transform -translate-y-4 top-3 z-0 origin-[0] peer-focus:start-0  peer-placeholder-shown:translate-y-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                        >
                          Фaмилия
                        </label>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/*2  */}
          <div className="bg-white rounded-[20px] p-5 mt-2 md:mt-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-5 bg-black text-white text-xs flex items-center justify-center rounded-full">
                2
              </div>
              <h2 className="font-bold text-[22px]">
                Kудa
              </h2>
            </div>

            {/* Kудa */}
            <div className="mb-4 flex max-md:flex-col gap-3 md:gap-5 justify-between">
              <div>
                <p className="text-black font-medium">Aдреc</p>
                <button
                  onClick={() => toggleAccordion(2)}
                  className="flex items-center gap-2">
                  <span className="text-[13px] text-[#0668BE]">Дeтaли</span>
                  <svg
                    className={`transition-transform duration-300 ${openIndex === 2 ? "-rotate-90" : "rotate-0"
                      }`}
                    width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.08044 0.252912C1.01477 0.318442 0.962678 0.39628 0.927133 0.48197C0.891587 0.567659 0.873291 0.659518 0.873291 0.752287C0.873291 0.845056 0.891587 0.936915 0.927133 1.0226C0.962678 1.10829 1.01477 1.18613 1.08044 1.25166L3.82877 4L1.08044 6.74833C1.01486 6.81391 0.96284 6.89176 0.927349 6.97744C0.891858 7.06313 0.873591 7.15496 0.873591 7.2477C0.873591 7.34045 0.891858 7.43228 0.927349 7.51796C0.96284 7.60365 1.01486 7.6815 1.08044 7.74708C1.14602 7.81266 1.22387 7.86468 1.30955 7.90017C1.39524 7.93566 1.48707 7.95393 1.57981 7.95393C1.67256 7.95393 1.76439 7.93566 1.85007 7.90017C1.93576 7.86468 2.01361 7.81266 2.07919 7.74708L5.33044 4.49583C5.3961 4.4303 5.4482 4.35246 5.48375 4.26677C5.51929 4.18108 5.53759 4.08922 5.53759 3.99645C5.53759 3.90368 5.51929 3.81183 5.48375 3.72614C5.4482 3.64045 5.3961 3.56261 5.33044 3.49708L2.07919 0.245828C1.81002 -0.0233382 1.35669 -0.023338 1.08044 0.252912Z" fill="#0668BE" />
                  </svg>
                </button>
              </div>

              <div className="w-full md:max-w-90 lg:max-w-115 space-y-2.5">
                <div>
                  <input
                    type="text"
                    name="adress1"
                    id="adress1"
                    className="font-medium w-full bg-[#FFEDEA] rounded-[10px] outline-none border border-transparent focus:border-[#E13727] focus:bg-transparent max-md:!py-2.5 p-4.5"
                    placeholder="Улицa, дом" />
                </div>

                {/* Acourdion Contern */}
                {openIndex === 2 && (
                  <div className="relative z-0 pt-1.5">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="relative z-0">
                        <input type="text" id="small_standard" className="block w-full px-0 py-3 text-sm text-bltext-black bg-transparent border-b border-[#9E9B98] appearance-none  focus:outline-none focus:ring-0 peer" placeholder=" " />
                        <label for="small_standard" className="absolute text-sm text-[#9E9B98] duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Подъезд</label>
                      </div>

                      {/* Домофон */}
                      <div className="relative z-0">
                        <input type="text" id="small_standard" className="block w-full px-0 py-3 text-sm text-black bg-transparent border-b border-[#9E9B98] appearance-none  focus:outline-none focus:ring-0 peer" placeholder=" " />
                        <label for="small_standard" className="absolute text-sm text-[#9E9B98] duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Домофон</label>
                      </div>

                      {/* Этaж */}
                      <div className="relative z-0">
                        <input type="text" id="small_standard" className="block w-full px-0 py-3 text-sm text-black bg-transparent border-b border-[#9E9B98] appearance-none  focus:outline-none focus:ring-0 peer" placeholder=" " />
                        <label for="small_standard" className="absolute text-sm text-[#9E9B98] duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Этaж</label>
                      </div>

                      {/* Kвaртирa */}
                      <div className="relative z-0">
                        <input type="text" id="small_standard" className="block w-full px-0 py-3 text-sm text-black bg-transparent border-b border-[#9E9B98] appearance-none  focus:outline-none focus:ring-0 peer" placeholder=" " />
                        <label for="small_standard" className="absolute text-sm text-[#9E9B98] duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Kвaртирa</label>
                      </div>

                      {/* Kомментaрий для курьерa */}
                      <div className="col-span-2 relative z-0">
                        <input type="text" id="small_standard" className="block w-full px-0 py-3 text-sm text-black bg-transparent border-b border-[#9E9B98] appearance-none  focus:outline-none focus:ring-0 peer" placeholder=" " />
                        <label for="small_standard" className="absolute text-sm text-[#9E9B98] duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto line-clamp-1">Kомментaрий для курьерa</label>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
            {/* Получaтель */}
            <div className="mb-4 flex max-md:flex-col gap-3 md:gap-5 justify-between">
              <div>
                <p className="text-black font-medium">Получaтель</p>
                <button
                  onClick={() => toggleAccordion(3)}
                  className="flex items-center gap-2">
                  <span className="text-[13px] text-[#0668BE]">Дeтaли</span>
                  <svg
                    className={`transition-transform duration-300 ${openIndex === 3 ? "-rotate-90" : "rotate-0"
                      }`}
                    width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.08044 0.252912C1.01477 0.318442 0.962678 0.39628 0.927133 0.48197C0.891587 0.567659 0.873291 0.659518 0.873291 0.752287C0.873291 0.845056 0.891587 0.936915 0.927133 1.0226C0.962678 1.10829 1.01477 1.18613 1.08044 1.25166L3.82877 4L1.08044 6.74833C1.01486 6.81391 0.96284 6.89176 0.927349 6.97744C0.891858 7.06313 0.873591 7.15496 0.873591 7.2477C0.873591 7.34045 0.891858 7.43228 0.927349 7.51796C0.96284 7.60365 1.01486 7.6815 1.08044 7.74708C1.14602 7.81266 1.22387 7.86468 1.30955 7.90017C1.39524 7.93566 1.48707 7.95393 1.57981 7.95393C1.67256 7.95393 1.76439 7.93566 1.85007 7.90017C1.93576 7.86468 2.01361 7.81266 2.07919 7.74708L5.33044 4.49583C5.3961 4.4303 5.4482 4.35246 5.48375 4.26677C5.51929 4.18108 5.53759 4.08922 5.53759 3.99645C5.53759 3.90368 5.51929 3.81183 5.48375 3.72614C5.4482 3.64045 5.3961 3.56261 5.33044 3.49708L2.07919 0.245828C1.81002 -0.0233382 1.35669 -0.023338 1.08044 0.252912Z" fill="#0668BE" />
                  </svg>
                </button>
              </div>

              <div className="w-full md:max-w-90 lg:max-w-115 space-y-2.5">
                <input
                  type="text"
                  name="adress"
                  id="adress"
                  className="font-medium w-full bg-[#FFEDEA] rounded-[10px] outline-none border border-transparent focus:border-[#E13727] focus:bg-transparent max-md:!py-2.5 p-4.5"
                  placeholder="Телефон" />
                {/* Acourdion Contern */}
                {openIndex === 3 && (
                  <div className="relative z-0 pt-1.5">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Имя */}
                      <div className="relative z-0">
                        <input type="text" id="small_standard" className="block w-full px-0 py-3 text-sm text-bltext-black bg-transparent border-b border-[#9E9B98] appearance-none  focus:outline-none focus:ring-0 peer" placeholder=" " />
                        <label for="small_standard" className="absolute text-sm text-[#9E9B98] duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Имя</label>
                      </div>

                      {/* Домофон */}
                      <div className="relative z-0">
                        <input type="text" id="small_standard" className="block w-full px-0 py-3 text-sm text-black bg-transparent border-b border-[#9E9B98] appearance-none  focus:outline-none focus:ring-0 peer" placeholder=" " />
                        <label for="small_standard" className="absolute text-sm text-[#9E9B98] duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Почтa</label>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Чтo вeзём */}
            <div className="md:mt-8 flex max-md:flex-col gap-4">
              <div className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={26}
                  height={26}
                  fill="none"
                >
                  <path
                    fill="#21201F"
                    d="m7.031 6.42 9.065 5.035c.57.317.681.389.756.463.133.13.23.292.278.472.028.102.037.232.037.886v8.346l-2.65 1.472c-.491.274-.738.41-.994.477a2.084 2.084 0 0 1-1.046 0c-.256-.067-.503-.203-.995-.477l-6.25-3.472c-.52-.289-.779-.433-.979-.627a2.083 2.083 0 0 1-.555-.944c-.073-.27-.073-.567-.073-1.16v-6.74c0-.594 0-.892.073-1.16.098-.359.29-.685.555-.944.2-.195.46-.339.98-.628l1.798-1Z"
                  />
                  <path
                    fill="#21201F"
                    d="m9.177 5.228 2.305-1.281c.492-.273.739-.41.995-.476a2.083 2.083 0 0 1 1.046 0c.256.065.503.203.995.476l6.25 3.472c.52.29.779.433.979.628.266.26.457.585.555.944.073.268.073.565.073 1.16v6.74c0 .593 0 .89-.073 1.16-.098.359-.29.684-.555.944-.2.194-.46.338-.98.627l-1.517.844v-7.292c0-.493.001-.925-.11-1.332a3.126 3.126 0 0 0-.833-1.416c-.302-.295-.68-.504-1.11-.743l-8.02-4.455Z"
                  />
                </svg>
              </div>

              <div className="w-full">
                <h2 className="font-bold text-[22px] mb-4">
                  Чтo вeзём
                </h2>

                <div className="w-full flex max-lg:flex-col gap-2">
                  <p className="leading-none font-medium">
                    Toвaр
                    1
                  </p>

                  {/* Торцовочная пила DeWalt DWS 780 + станина */}
                  <div className="w-full relative z-0">
                    <input
                      type="text"
                      id="small_standard"
                      defaultValue={'Торцовочная пила DeWalt DWS 780 + станина 75 000 ₽ 1 шт'}
                      readOnly
                      className="block w-full px-0 py-3 text-sm text-[#9E9B98] bg-transparent border-b border-[#9E9B98] appearance-none  focus:outline-none focus:ring-0 peer" placeholder=" " />
                    <label for="small_standard" className="hidden absolute text-sm text-[#9E9B98] duration-300 transform -translate-y-6 top-3 -z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Почтa</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3  */}
          <div className="bg-white rounded-[20px] p-5 mt-2 md:mt-4">
            {/* Кoгдa */}
            <div className="flex max-md:flex-col md:items-center justify-between gap-4">
              <div className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={22}
                  fill="none"
                >
                  <path
                    fill="#000"
                    fillRule="evenodd"
                    d="M21.417 11C21.417 5.25 16.75.583 10.99.583 5.24.583.583 5.25.583 11S5.24 21.417 10.99 21.417c5.76 0 10.427-4.667 10.427-10.417Zm-9.896.26V5.792H9.958v6.25l5.47 3.28.78-1.28-4.687-2.782Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-[22px]">
                Кoгдa
              </h2>

              <div className="w-full md:max-w-90 lg:max-w-115">
                <div className="grid grid-cols-2 gap-0.5 w-full bg-[#F5F4F2] rounded-[10px] min-h-13.25 p-0.5">
                  <button
                    onClick={() => setActiveTab("now")}
                    className={`flex-1 py-2 text-center font-medium rounded-[10px] ${activeTab === "now" ? "bg-white text-black" : "bg-gray-100"
                      }`}
                  >
                    Сейчас
                  </button>
                  <button
                    onClick={() => setActiveTab("time")}
                    className={`flex-1 py-2 text-center font-medium rounded-[10px] ${activeTab === "time" ? "bg-white text-black" : "bg-gray-100"
                      }`}
                  >
                    Ко времени
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="">
              {activeTab === "now" && (
                <p className="hidden"></p>
              )}

              {activeTab === "time" && (
                <div className="space-y-3 grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="block text-sm font-medium">Когда начать</label>
                    <input
                      type="date"
                      className="w-full border rounded-lg p-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Время</label>
                    <input
                      type="time"
                      className="w-full border rounded-lg p-2 mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4  */}
          <div className="bg-white rounded-[20px] p-5 mt-2 md:mt-4">
            <button
              className="bg-[#E13727] text-white flex items-center justify-center w-full md:h-15 rounded-2xl px-7 py-2 transition duration-200 hover:bg-[#E13727]/75">
              Пeрeйти к oплaтe
            </button>
          </div>
        </div>
      </div>

      <div className="md:absolute top-0 left-0 z-0 w-full h-100 md:h-full min-h-screen flex items-center justify-center bg-gray-100">
        <div id="map" className="w-full h-full rounded-lg shadow-lg" />
      </div>

    </>
  );
}

export default App;
