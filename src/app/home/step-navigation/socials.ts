import 'jquery';

function getTitle(){
    return $('head title').text();
}

function getProp(name){
    return $(`meta[property="${name}"]`).attr('content');
}

export interface Socials {
    linkedin: string,
    facebook: string,
    twitter: string
}

export function initSocials(){
    let title = encodeURIComponent(getTitle());
    let url   = encodeURIComponent(getProp('fb:link'));
    let desc  = encodeURIComponent(getProp('description'));
    let tweet = encodeURIComponent(getProp('tweet_text'));
    return {
        linkedin: `https://www.linkedin.com/shareArticle?url=${url}&title=${title}&summary=${desc}&mini=true`,
        twitter: `https://twitter.com/intent/tweet?text=${tweet}&url=${url}&via=Agence-Skoli`,
        facebook: `https://facebook.com/sharer.php?url=${url}`
    }
}
