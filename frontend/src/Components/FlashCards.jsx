import React from "react";
import { FaUser } from "react-icons/fa";
import Carousel from "react-bootstrap/Carousel";
import "./FlashCards.css";
const FlashCards = () => {
  return (
    <div className="w-[80%] mx-auto">
      <div className="flex-col flex items-center justify-center">
        <div className="flex flex-col p-4 w-[100%]">
          <div className="bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
            <FaUser className="text-blue-900 text-2xl ml-4" />
            <h1 className="text-blue-900 text-2xl font-bold ml-2">
              FlashCards
            </h1>
          </div>
        </div>
        <hr className="border-blue-900 w-[95%]" />
      </div>

      <Carousel className=" h-[80vh] flex items-center" interval={null}>
        <Carousel.Item>
          <div className="flex items-center justify-center h-full">
            <div className="flashcard p-6 bg-blue-200 text-center rounded-lg w-[80%] max-w-[800px]">
              <h3 className="text-xl font-bold">Flashcard 1</h3>
              <p className="text-lg mt-2">
                W distribution of letters, as opposed to using 'Content here,
                content here', making it look like readable English. Many
                desktop publishing packages and web page editors now use Lorem I
                undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
                1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good
                and Evil) by Cicero, written in 45 BC. This book is a treatise
                on the theory of ethics, very popular during the Renaissance.
                believable. If you are going to use a passage of Lorem Ipsum,
                you need to be sure there isn't anything embarrassing hidden in
                the middle of text. All the Lorem Ipsum generators on the
                Internet tend to repeat predefined chunks as necessary, making
                this the first true generator on the Internet. It uses a
                dictionary of over 200 Latin words, combined with a handful of
                model sentence structures, to generate Lorem Ipsum which looks
                reasonable. The generated Lorem Ipsum is therefore always free
                from repetition, injected humour, or non-characteristic words
                etc. 5 paragraphs words bytes lists Start with 'Lorem ipsum
                dolor sit amet...' ?
              </p>
              <p className="text-md mt-2 text-gray-700">Paris</p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="flex items-center justify-center h-full">
            <div className="flashcard p-6 bg-blue-200 text-center rounded-lg w-[80%] max-w-[800px]">
              <h3 className="text-xl font-bold">Flashcard 2</h3>
              <p className="text-lg mt-2">What is 2 + 2?</p>
              <p className="text-md mt-2 text-gray-700">4</p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="flex items-center justify-center h-full">
            <div className="flashcard p-6 bg-blue-200 text-center rounded-lg w-[80%] max-w-[800px]">
              <h3 className="text-xl font-bold">Flashcard 3</h3>
              <p className="text-lg mt-2">
                What is the largest planet in our solar system?
              </p>
              <p className="text-md mt-2 text-gray-700">Jupiter</p>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default FlashCards;
