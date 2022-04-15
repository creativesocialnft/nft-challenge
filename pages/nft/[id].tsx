import React, { useEffect, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { sanityClient, urlFor } from '../../sanity'
import { GetServerSideProps } from 'next'
import { Collection } from '../../typings'
import notFound from 'next'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import toast, {Toaster} from 'react-hot-toast'

interface Props {
  collection: Collection
}

function NFTDropPage({ collection }: Props) {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [priceInEth, setPriceInEth] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [minted, setMinted] = useState<boolean>(false)
  const [claimedTokenId, setClaimedTokenId] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const nftDrop = useNFTDrop(collection.address)

  const connectWithMetamask = useMetamask()
  const disconnectWithMetamask = useDisconnect()
  const address = useAddress()

  useEffect(() => {
    if (!nftDrop) return

    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
    }

    fetchPrice()
  }, [nftDrop, minted])

  useEffect(() => {
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setLoading(true)
      setMessage('Loading NFT Supply Count...')
      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)

      setLoading(false)
      setMessage('')
    }

    fetchNFTDropData()
  }, [nftDrop, minted])

  const mintNft = () => {
    if (!nftDrop || !address) return
    setLoading(true)
    const quantity = 1
    const notification = toast.loading('Minting NFT...', {
      style: {
        background: 'white',
        color: 'green',
        fontWeight: 'bolder',
        fontSize: '17px',
        padding: '20px',
      }
    } )
    setMessage('Minting...')
    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt
        const newClaimedTokenId = tx[0].id
        const claimedNFT = await tx[0].data()
        setClaimedTokenId(newClaimedTokenId.toString())

        toast('Nice...You successfully Minted!', {
          duration: 6000,
          style: {
            background: 'white',
            color: 'green',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          }          
        })

        console.log(receipt)
        console.log(claimedTokenId)
        console.log(claimedNFT)
      })
      .catch((err) => {
        console.log(err)
        toast('Whoops...Something went wrong', {
          style: {
            background: 'red',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          }          
        })
      })
      .finally(() => {
        setLoading(false)
        setMinted(true)
        setMessage('Minted...')
        toast.dismiss(notification)
      })
  }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position='bottom-center' />
      {/* LEFT SIDE */}
      <div className="bg-gradient-to-br from-purple-500 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2 shadow-2xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.mainImage).url()}
              alt="Apes"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.title}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href={'/'}>
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              The{' '}
              <span className="font-extrabold underline decoration-pink-600/50">
                Creative Social
              </span>{' '}
              NFT Marketplace
            </h1>
          </Link>
          {/* <h4>Connected as: {address}</h4> */}

          <button
            onClick={() =>
              address ? disconnectWithMetamask() : connectWithMetamask()
            }
            className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Disconnect' : 'Connect'}
          </button>
        </header>
        <hr className="my-2 border" />
        {address && (
          <p className="text-center text-sm text-green-500">
            You're logged in with wallet{' '}
            <b>
              {address.substring(0, 5)}...
              {address.substring(address.length - 5)}
            </b>
          </p>
        )}


        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 rounded-lg text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 rounded-lg object-cover pb-10 lg:h-40"
            src={urlFor(collection.previewImage).url()}
          />
          <h1 className="text-3xl font-bold lg:text-4xl lg:font-bold">
            The Creative Social Luminary Club | NFT Drop
          </h1>
          {loading ? (
            <p className="animate-pulse pt-2 text-xl text-green-500">
              {message} 
            </p>
          ) : (
            <p className="pt-2 text-green-500">
              {claimedSupply} / {totalSupply?.toString()} NFT's Claimed
            </p>
          )}

          {loading && (
            <img
              className="h-80 w-80 object-contain"
              src="/loading.gif"
              alt="Loading"
            />
          )}
          {minted && address && (
          <p className="text-center text-md pt-4 text-green-800">
            You have successfully Minted your NFT!<br/>
            <b><a href={`https://testnets.opensea.io/assets/${collection.address}/${claimedTokenId}`}>View on OpenSea</a></b>
          </p>
        )}
        </div>
        {/* Mint Button */}
        <button
          onClick={mintNft}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="text-full mt-10 h-16 w-full rounded-full bg-red-600 text-2xl text-white disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>Sign In to Mint</>
          ) : (
            <span className="font-bold">Mint NFT ({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionImage,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator -> {
      _id,
      name,
      address,
      slug{
        current
      },
    },
  }
  `

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    notFound: true
  }

  return {
    props: {
      collection,
    },
  }
}
