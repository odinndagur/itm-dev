//@ts-nocheck
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link, useMatch } from '@tanstack/react-location'
import { getSignById, query } from '../db'
import { YoutubeEmbed } from './YoutubeEmbed'
import './signpage.css'

function SignPage() {
    const {
        data: {
            // You can access any data merged in from parent loaders as well
            sign,
        },
    } = useMatch()

    if (!sign) {
        return ''
    }

    return (
        <div className="sign" id={sign.sign_id}>
            <div>
                <div>
                    <h2 className="sign-phrase">{sign.phrase}</h2>
                    {/* {sign} */}
                    <YoutubeEmbed embedId={sign.youtube_ids[0]} />
                </div>
                <div className="sign-info">
                    {sign.efnisflokkar && (
                        <div className="sign-info-item">
                            <b>Efnisflokkar</b>
                            {sign.efnisflokkar.map((efnisflokkur) => {
                                return (
                                    <div key={efnisflokkur}>
                                        <Link
                                            to={`/efnisflokkar/${efnisflokkur}`}
                                        >
                                            {efnisflokkur}
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {sign.ordflokkur && (
                        <div className="sign-info-item">
                            <b>Orðflokkur</b>
                            <div>
                                <Link to={`/ordflokkar/${sign.ordflokkur}`}>
                                    {sign.ordflokkur}
                                </Link>
                            </div>
                        </div>
                    )}
                    {sign.myndunarstadur && (
                        <div className="sign-info-item">
                            <b>Myndunarstaður</b>
                            <div>
                                <Link
                                    to={`/myndunarstadir/${sign.myndunarstadur}`}
                                >
                                    {sign.myndunarstadur}
                                </Link>
                            </div>
                        </div>
                    )}
                    {sign.handform && (
                        <div className="sign-info-item">
                            <b>Handform</b>
                            <div>
                                <Link to={`/handform/${sign.handform}`}>
                                    {sign.handform}
                                </Link>
                            </div>
                        </div>
                    )}
                    {sign.description && (
                        <div className="sign-info-item">
                            <b>Lýsing</b>
                            <div>{sign.description}</div>
                        </div>
                    )}
                    {sign.related_signs &&
                        sign.related_signs.split(',').map((phrase) => {
                            return phrase
                        })}
                </div>
            </div>
            <div className="alternate-videos">
                {sign.islenska && (
                    <div className="sign-info-item">
                        <b>Íslenska</b>
                        <div>{sign.islenska}</div>
                    </div>
                )}
                {sign.taknmal && (
                    <div className="sign-info-item">
                        <b>Táknmál</b>
                        <div>{sign.taknmal}</div>
                    </div>
                )}
                {sign.youtube_ids.slice(1).map((id) => {
                    return (
                        <div className="alternate-video" key={id}>
                            <YoutubeEmbed embedId={id} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SignPage
