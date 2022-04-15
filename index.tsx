import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>PAPAFAM NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="sticky top-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-500 to-cyan-500 p-2 py-5 shadow-md lg:px-5">
        <h1 className="text-3xl">Welcome to the NFT DROP CHALLENGE</h1>
      </div>
      <div className="flex flex-col items-center py-2 pt-20 lg:min-h-screen">
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
      </div>
    </div>
  )
}

export default Home
