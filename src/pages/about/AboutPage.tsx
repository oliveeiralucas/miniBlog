import React from 'react'
import { BiChevronsDown, BiCodeCurly } from 'react-icons/bi'

const AboutPage: React.FC = () => {
  return (
    <body className="">
      <section className="z-0 flex h-[86vh] max-w-7xl flex-col items-center justify-center bg-gray-50">
        <BiCodeCurly className="mx-auto mb-4 text-6xl font-bold text-blue-700" />
        <h1 className="mx-auto mb-5 max-w-2xl text-center text-4xl  font-bold text-gray-900 md:text-5xl md:leading-normal">
          Bem vindo(a) ao meu <span className="text-blue-600">Dev Blog</span>
        </h1>
        <p className="mx-auto mb-9 max-w-lg text-center text-base font-normal leading-7 text-gray-700">
          Aqui compartilho minhas experiências, aprendizados e insights do mundo
          da programação e desenvolvimento web.
        </p>
        <a
          className="flex items-center gap-2 rounded-lg bg-blue-700 px-12 py-3 text-xl font-bold text-white"
          href="#aboutme"
        >
          Rolar
          <BiChevronsDown className="animate-bounce" />
        </a>
      </section>

      <section className="relative py-14 lg:py-24" id="aboutme">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <img
              src="https://avatars.githubusercontent.com/u/124714081?v=4"
              alt="Lucas oliveira"
              className="rounded-lg"
            />
            <div className="flex items-center">
              <div className="">
                <h2 className="relative mb-9 text-4xl font-bold text-black max-lg:text-center lg:text-5xl">
                  Sobre Mim
                </h2>
                <p className="mx-auto max-w-2xl text-xl font-normal leading-8 text-gray-500 max-lg:text-center">
                  Olá! Eu sou o Lucas Oliveira, estudante de Engenharia de
                  Software e atualmente atuando como desenvolvedor web.
                  Bem-vindo ao meu blog, onde compartilho minhas experiências,
                  aprendizados e insights do mundo da programação e
                  desenvolvimento web
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-14 lg:py-24" id="aboutme">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 gap-9 lg:grid-cols-2">
            <div className="flex items-center">
              <div className="">
                <h2 className="relative mb-9 text-4xl font-bold text-black max-lg:text-center lg:text-5xl">
                  Minha Jornada
                </h2>
                <p className="mx-auto max-w-2xl text-xl font-normal leading-8 text-gray-500 max-lg:text-center">
                  Minha jornada na área de tecnologia começou com um interesse
                  genuíno por computadores e pela maneira como a internet
                  funcionava. Ao longo dos anos, mergulhei de cabeça nos estudos
                  de programação e desenvolvimento web. Desde então, tenho me
                  dedicado a aprender constantemente e aprimorar minhas
                  habilidades para criar soluções digitais cada vez melhores.
                </p>
              </div>
            </div>
            <img
              src="https://blog.unifil.br/wp-content/uploads/Alunos-no-lancamento-do-hackathon-1.jpeg"
              alt="Lucas oliveira"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-14 text-center text-4xl font-bold text-gray-900">
            Algumas informações
          </h2>
          <div className="flex flex-col gap-5 lg:flex-row lg:justify-between xl:gap-8">
            <div className="mx-auto w-full rounded-2xl bg-white p-6 shadow-md shadow-gray-100 max-lg:max-w-2xl lg:mx-0 lg:w-1/3">
              <div className="flex gap-5">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="flex-1">
                  <h4 className="mb-2 text-xl font-semibold text-gray-900">
                    Posts Publicados
                  </h4>
                  <p className="text-xs leading-5 text-gray-500">
                    total de posts publicados nesse blog
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full rounded-2xl bg-white p-6 shadow-md shadow-gray-100 max-lg:max-w-2xl lg:mx-0 lg:w-1/3">
              <div className="flex gap-5">
                <div className=" text-2xl font-bold text-blue-600">850+</div>
                <div className="flex-1">
                  <h4 className="mb-2 text-xl font-semibold text-gray-900">
                    Horas de desenvolvimento
                  </h4>
                  <p className="text-xs leading-5 text-gray-500">
                    Total de horas de desenvolvimento desde o início da minha
                    jornada
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full rounded-2xl bg-white p-6 shadow-md shadow-gray-100 max-lg:max-w-2xl lg:mx-0 lg:w-1/3">
              <div className="flex gap-5">
                <div className=" text-2xl font-bold text-blue-600">15+</div>
                <div className="flex-1">
                  <h4 className="mb-2 text-xl font-semibold text-gray-900">
                    Projetos completados
                  </h4>
                  <p className="text-xs leading-5 text-gray-500">
                    para conferir mais, basta acessar o meu portfólio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" bg-gray-50 py-14 lg:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 rounded-full">
            <h2 className=" text-center text-4xl font-bold text-gray-900">
              O Que Você Pode Esperar?
            </h2>
          </div>

          <div className="">
            <div className="mx-auto max-w-max lg:max-w-4xl">
              <p className="mb-8 text-center text-lg leading-8 text-gray-500">
                Neste blog, você encontrará uma variedade de conteúdos
                relacionados a programação, desenvolvimento web, dicas práticas,
                tutoriais e reflexões sobre a indústria de tecnologia. Meu
                objetivo é fornecer conteúdo útil e inspirador que possa
                ajudá-lo em sua jornada como desenvolvedor ou entusiasta de
                tecnologia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </body>
  )
}

export default AboutPage
