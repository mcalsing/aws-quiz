import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Loading from "./Loading";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStateQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/quiz");
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="w-[800px] px-4 mx-auto mt-8 flex bg-slate-300 rounded-md">
      {loading && <Loading />}

      <div className="w-full space-y-5">
        <h2 className="lg:text-2xl text-xl text-slate-700 flex justify-center border-b-2 border-gray-400">
          Bem-vindo ao simulado CLF-C02!
        </h2>
        <p className="text-slate-800 text-justify">
          Neste projeto, você poderá testar seus conhecimentos e se familiarizar com os tópicos essenciais para o exame AWS Cloud Practitioner. O quiz oferece uma experiência de aprendizado interativa e abrangente, permitindo que você identifique áreas de aprimoramento e se prepare para o exame de forma eficaz (Em desenvolvimento, todos os tópicos ainda não foram abordados).
        </p>
        <p className="text-slate-800 text-justify"><b>O quiz é composto por 25 perguntas e o tempo para respondê-las é de 35 minutos</b>. Todas as perguntas foram tiradas do programa re/Start da AWS, em parceria com a Escola da Nuvem do qual faço parte. Até o momento (19/06), os KCs utilizados são: 5, 208, 6, 7, 8, 209, 9, 10 e 12. Esses KCs compreendem os conceitos iniciais da Nuvem AWS e os serviços mais comuns. Todas as descrições dos serviços foram retiradas do site da Amazon e do site de documentação.</p>
        <div className="flex justify-center">
          <button
            onClick={handleStateQuiz}
            className="bg-sky-800 px-6 py-2 text-white rounded w-40"
          >
            Começar Quiz
          </button>
        </div>
        <p className="text-slate-800 text-justify">
          Nota: Este projeto de simulado é uma iniciativa independente e não tem afiliação, ou qualquer relação oficial com a Amazon Web Services (AWS). Foi desenvolvido com o objetivo de fornecer recursos educacionais para indivíduos que estão se preparando para o exame AWS Cloud Practitioner (CLF-C02) e não deve ser considerado como substituto dos materiais oficiais de estudo fornecidos pela AWS.
        </p>
        <h2 className="flex justify-center text-2xl text-slate-800">Desenvolvido por: Marcelo Calsing</h2>
        <div className="flex gap-4 w-full justify-center">
          <a href="https://linkedin.com/in/marcelocalsing" target="_blank" className="cursor-pointer">
            <img src="/images/linkedin.png" alt="logolinkedin" width={28} height={24} className="invert hover:w-8"/>
          </a>
          <a href="https://github.com/mcalsing" target="_blank" className="cursor-pointer">
            <img src="/images/github.png" alt="logogithub" width={28} height={24} className="invert cursor-pointer hover:w-8"/>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
