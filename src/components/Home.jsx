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
    <section className="w-[800px] px-4 mx-auto mt-12 flex bg-slate-300 rounded-md">
      {loading && <Loading />}

      <div className="w-full space-y-5">
        <h2 className="lg:text-2xl text-xl text-slate-700 flex justify-center border-b-2 border-gray-400">
          Bem-vindo ao simulado CLF-C02!
        </h2>
        <p className="text-slate-800">
          Este é um projeto independente afim de testar seus (o meu também) conhecimento para o exame de AWS Cloud Practitioner.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleStateQuiz}
            className="bg-sky-800 px-6 py-2 text-white rounded w-40"
          >
            Começar Quiz
          </button>
        </div>
          <p className="text-justify text-slate-800">
            Nota: Este projeto de simulado é uma iniciativa independente e não tem afiliação, endosso ou qualquer relação oficial com a Amazon Web Services (AWS). Foi desenvolvido com o objetivo de fornecer recursos educacionais para indivíduos que estão se preparando para o exame AWS Cloud Practitioner (CLF-C02) e não deve ser considerado como substituto dos materiais oficiais de estudo fornecidos pela AWS.
          </p>
      </div>
    </section>
  );
};

export default Home;
