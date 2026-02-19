import React from 'react'

import FormCreatePost from './form/FormCreatePost'

const CreatePost: React.FC = () => {
  return (
    <div className="bg-ed-bg">
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-10">
          <p className="section-label mb-2">Publicações</p>
          <div className="gold-line mb-4" />
          <h1 className="font-display text-3xl md:text-4xl text-ed-tp">
            Nova Publicação
          </h1>
          <p className="font-body text-sm text-ed-ts mt-2">
            Compartilhe seus pensamentos e aprendizados com o mundo.
          </p>
        </div>
      </section>
      <div className="page-wrapper py-10">
        <div className="max-w-2xl">
          <FormCreatePost />
        </div>
      </div>
    </div>
  )
}

export default CreatePost
