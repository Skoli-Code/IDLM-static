let d = (y)=>(new Date(new Date(y, 12, 0)))

export interface IPeriod {
    dates: [Date, Date];
    content: string
}

export var PERIODS:IPeriod[] = [
{
    dates: [ d(1997), d(2001​) ],
    content:`<span class="bold underline">1997 – 2001​: attentats terroristes</span>

    Durant cette période, bien que de nombreux attentats frappent en Afrique (Algérie, Egypte, Kenya, Tanzanie) et sur le continent asiatique (Afghanistan, Yémen, Inde, Indonésie), la question de l’islam n’est pas significativement traitée à la lumièrede ces événements.`
},
{
    dates: [ d(2001), d(2004​) ],
    content:`<span class="underline">2001 – 2004​: Le 11 septembre et ses conséquences (Afghanistan, Irak, politisation </span> débat surbold  l’islam)**

    Cette période est d’abord marquée par les **attentats du 11 septembre 2001** sur le sol américain. Hautement symboliques, ces attentats font connaître au grand public la nébuleuse Al Qaïda et ses leaders, au premier rang desquels figure Oussama Ben Laden. S’initie alors la « **guerre contre le terrorisme** » qui se traduit par l’intervention menée par les Etats-Unis en **Afghanistan** (2001) puis l’invasion américaine en **Irak** (2003).  En 2004, **Madrid** est frappé par un **attentat**. Des décapitations d’otages - notamment occidentaux - retenus en Irak sont mise en scènes et amplement relayées sur la toile. En France, l’islam devient un sujet politique, la question du **voile** est mise à l’agenda (Commission Stasi, affaire Alma et Lila Lévy, , loi du 15 mars 2004).`
},
{
    dates: [ d(2005), d(2007) ],
    content:`<span class="bold underline">2005 – 2007: Contexte international tendu, malaise  croissant en France</span>

    2005 est marquée par l’**attentat de Londres**. En France, les réactions consécutives aux publications des **caricatures** du Prophète Mohammed par Charlie Hebdo puis au **discours de Ratisbonne** tenu par le Pape Benoît XVI questionnent le rapport entre islam et liberté d’expression. Dans le même temps, la guerre civile aux relents confessionnels ensanglante l’**Irak** tandis que le dossier **nucléaire iranien** est au point mort.`
},
{
    dates: [ d(2009), d(2010) ],
    content:`<span class="bold underline">2009 – 2010: Un “problème” Français</span>

    En parallèle à l’ouverture du **débat** sur l’**identité nationale** au cours de cette période, de multiples débats polémiques impliquant l’islam directement ou indirectement. Parmi les débats majeurs, outre la question des **minarets** (2009) ou la polémique concernant les **prières de rue**, la loi interdisant la **dissimulation du visage** dans l’espace public est particulièrement traitée.`
},
{
    dates: [ d(2011), d(2013) ],
    content:`<span class="bold underline">2011 – 2013: Printemps arabes, hivers islamistes. La France en guerres</span>

    Au cours de cette période, lesdits « **printemps arabes** » sont très suivis par les médias français. Et ce, d’autant plus avec l’entrée en jeu d’acteurs islamistes dans les processus de transition et les débats autour de certains réformes constitutionnelles (égalité hommes femmes, question de la shari’a). Divers conflits (**crise syrienne**) et **interventions militaires** menées par la France (Libye, Mali) éclatent dans cet intervalle. Parallèlement, la **campagne pour la présidentielle** française met à l’agenda la question de l’islam (polémique sur le **halal**, affaire **Babyloup**, affaire **Merah**).`
},
{
    dates: [ d(2014), d(2015) ],
    content:`<span class="bold underline">2014 – 2015: Etat Islamique et attentats en Europe</span>

    La spectaculaire montée de l’organisation **Etat islamique** (EI), amplement médiatisée du fait de son extrême violence, initie cette période. La régionalisation puis l’internationalisation du conflit syro-irakien est amplement traitée par les médias. Surtout, les **attentats** perpétrés dans l’hexagone et en Occident, puis la résurgence de la **crise des réfugiés** (2015), relancent un large débat sur l’islam et la violence et, par extension, le « **problème musulman** » en France et en Occident.`
}
];
