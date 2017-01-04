#!/usr/bin/env zsh

updatePages(){
    # args:
    # 0 - updatePages
    # 1 - CNAME
    ng build
    cd dist
    echo "islam-objet-mediatique.fr" > CNAME
    cp ../src/404.html .
    git init && ga --all
    gc -m "Update"
    git remote add origin git@github.com:Skoli-Code/IDLM-static.git
    gp origin master:gh-pages --force
    echo "Udpate done !"
    cd ..
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
