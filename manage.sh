#!/usr/bin/env zsh

updatePages(){
    # args:
    # 1 - CNAME
    # 2 - remote URL
    # 3 - remote branch to use
    cname=${@[1]:-islam-objet-mediatique.fr}
    remote_url=${@[2]:-git\@github.com\:Skoli-Code\/IDLM-static.git}
    branch=${@[3]:-gh-pages}
    echo "CNAME: $cname"
    echo "repository URL: $remote_url"
    echo "Remote branch to use for pages: $branch"
    ng build
    cd dist
    echo $cname > CNAME
    cp ../src/404.html .
    git init && git add --all
    git commit -m " Update"
    git remote add origin $remote_url
    git push origin master:$branch
    echo "Udpate done !"
    cd ..
}

updateEnglishPages(){
    git checkout english
    remote_url="git@github.com:Skoli-Code/IDLM-english.git"
    updatePages "en.islam-objet-mediatique.fr" $remote_url master
    git checkout master
}

run(){
    ng serve ${@:1}
}


if [[ "$(type -w $@)" =~ .*function ]];
then
    echo Starting "$@"
    eval $(printf "%q " "$@")
else
    echo "Function $@ not found, please check manage.sh file"
fi
