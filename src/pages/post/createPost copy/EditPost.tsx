import React from 'react'

import FormEditPost from './form/FormEditPost'

const EditPost: React.FC = () => {
  return (
    <div className="bg-ed-bg">
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-10">
          <p className="section-label mb-2">Publicações</p>
          <div className="gold-line mb-4" />
          <h1 className="font-display text-3xl md:text-4xl text-ed-tp">
            Editar Publicação
          </h1>
          <p className="font-body text-sm text-ed-ts mt-2">
            Atualize os detalhes do seu artigo.
          </p>
        </div>
      </section>
      <div className="page-wrapper py-10">
        <div className="max-w-2xl">
          <FormEditPost />
        </div>
      </div>
    </div>
  )
}

export default EditPost
