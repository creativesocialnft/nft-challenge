import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import bg from '../public/bg.jpg'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col py-20 px-10 2xl:px-0">
      <Head>
        <title>PAPAFAM NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-10 text-4xl font-extralight">
        The{' '}
        <span className="font-extrabold underline decoration-pink-600/50">
          Creative Social
        </span>{' '}
        NFT Marketplace
      </h1>

      <main className="bg-slate-100 p-10 shadow-xl shadow-purple-400/50">
        <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {collections.map((collection) => (
            <Link href={`/nft/${collection.slug.current}`} key={collection._id}>
              <div className="flex cursor-pointer flex-col items-center transition-all duration-200 hover:scale-105">
                <img
                  className="h-96 w-60 rounded-2xl object-cover"
                  src={urlFor(collection.mainImage).url()}
                  alt=""
                />

                <div className="p-5">
                  <h2 className="text-3xl">{collection.title}</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    {collection.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* <div className="flex flex-col items-center py-2 pt-20 lg:min-h-screen">
        <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2 shadow-2xl">
          <Link href="/nft/whatsEatingGilbert">
            <img
              className="w-44 cursor-pointer rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt="Apes"
            />
          </Link>
        </div>
        <div>
          <Link href="/nft/EatingGilbertTheApe">
            <button className="text-full h-25 mt-20 w-full rounded-full bg-purple-600 p-10 py-5 text-lg font-bold text-white">
              Mint Gilbert Grape The Ape
            </button>
          </Link>
        </div>
      </div> */}
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"] {
    _id,title,address,
    description,
    nftCollectionImage,
    mainImage {asset},
  previewImage {asset},
  slug {current},
  creator -> {_id,name,address,slug{current},},
  }`

  const collections = await sanityClient.fetch(query)
  console.log(collections)
  return {
    props: {
      collections,
    },
  }
}
