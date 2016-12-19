import 'jquery';

let _enc_ = encodeURIComponent;

export interface Socials {
    linkedin: string,
    twitter: string
}

export var meta = {
    url: 'http://islam-objet-mediatique.fr',
    twitter: {
        tweet: _enc_('“Islam, media subject" - Islam in the French daily national press - 1997-2015'),
        hashtags: ['islam', 'dataviz'].join(',')
    },
    linkedin: {
        title: _enc_('“Islam, media subject" - Islam in the French daily national press - 1997-2015'),
        summary: _enc_('Analysis of textual data and datavisualizations on the treatment of Islam in the press, from the archives of three major french newspapers. By Skoli and M.Bourekba.'),
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
