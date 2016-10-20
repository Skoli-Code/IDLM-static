import 'jquery';

let _enc_ = encodeURIComponent;

export interface Socials {
    linkedin: string,
    twitter: string
}

export var meta = {
    url: 'http://islam-objet.mediatique.fr',
    twitter: {
        tweet: _enc_('“L\'islam, objet médiatique” - Étude sur le traitement médiatique de l\'islam dans la presse française'),
        hashtags: ['islam', 'dataviz'].join(',')
    },
    linkedin: {
        title: _enc_('“L\'islam, objet médiatique” - Étude sur le traitement médiatique de l’islam dans la presse française (1997-2015)'),
        summary: _enc_('Analyse de données textuelles et datavisualisations sur le traitement de l\'islam dans la presse, à partir des archives de trois grands quotidiens. Par Skoli et M.Bourekba.'),
        source: _enc_('Skoli')
    }
}
export function initSocials(){
    let url = _enc_(meta.url)
    return {
        linkedin: `https://www.linkedin.com/shareArticle?url=${url}&source=${meta.linkedin.source}&title=${meta.linkedin.title}&summary=${meta.linkedin.summary}&mini=true`,
        twitter: `https://twitter.com/intent/tweet?text=${meta.twitter.tweet}&url=${url}&hastags=${meta.twitter.hashtags}`
    }
}
