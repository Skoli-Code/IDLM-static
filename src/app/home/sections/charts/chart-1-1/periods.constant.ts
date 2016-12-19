let start = (y)=>(new Date(new Date(y, 0, 1)))
let end = (y)=>(new Date(new Date(y, 12, 0)))

export interface IPeriod {
    dates: [Date, Date];
    content: string
}

export var PERIODS:IPeriod[] = [
{
    dates: [ start(1997), end(2000​) ],
    content:`<span class="bold underline">1997 – 2000​: terrorist attacks.</span>

    During this period, although numerous attacks hit Africa (Algeria, Egypt, Kenya, Tanzania) and Asia (Afghanistan, Yemen, India, Indonesia), the events are not significantly covered using the prism of religion. In this period, Islam remains a marginal media issue.
`
},
{
    dates: [ start(2001), end(2004​) ],
    content:`<span class="bold underline">2001 – 2004​: The 11th of September 2001 and its consequences (Afghanistan, Iraq, the politicisation of the debate on Islam).</span>

    This period is marked by the **11th of September 2001 attacks**. Highly symbolic, they bring to light the nebulous Al-Qaeda and its leaders (among them Osama bin Laden). The **“War on Terror”** begins – from the intervention led by the United States in **Afghanistan** (2001) to the US invasion of **Iraq** (2003). In 2004, **Madrid** is hit by an **attack**. The decapitation of hostages – particularly Westerners – captured in Iraq is filmed and relayed on the internet. In France, Islam becomes a political subject, the issue of the **veil** comes on to the agenda (Commission Stasi, the Alma and Lila Lévy affair, the 15 March 2004 law).`
},
{
    dates: [ start(2005), end(2007) ],
    content:`<span class="bold underline">2005 – 2007​: Tense international context, growing discontent in France.</span>

    2005 is marked by the **attacks on London**. In France, the consecutive reactions to the publication of the **cartoons of the Prophet Mohammed** by Charlie Hebdo and the **Regensburg address** given by Pope Benedict XVI question the relationship between Islam and freedom of expression. At the same time, in **Iraq** there is a bloody civil war with religious overtones while the **Iranian nuclear dossier** is at a stalemate. During this period, the media coverage of Islam sees a net decline.`
},
{
    dates: [ start(2009), end(2010) ],
    content:`<span class="bold underline">2009 – 2010​: A French “problem”.</span>

    Alongside the start of the **debate on national identity** in this period, multiple controversial debates involve Islam directly or indirectly. Among the major debates, in addition to the issue of **minarets** (2009) and the controversy about **street prayers**, the law prohibiting the **covering of the face** in the public space is given particular coverage.
`
},
{
    dates: [ start(2011), end(2013) ],
    content:`<span class="bold underline">2011 – 2013​: Arab Springs, Islamist winters. France at war.</span>

    Throughout this period, the so-called “**Arab Spring**” is closely followed by the French media. All the more so when Islamist actors come into play in the transition processes and the debates around certain constitutional reforms (male-female equality, the issue of sharia law). Various conflicts (**Syria crisis**) and **military interventions** led by France (Libya, Mali) break out in this period. In parallel, the **French presidential campaign** puts the issue of Islam on the agenda (**halal controversy**, **Babyloup** affair). 2012 is still marked by the **Merah** affair. Islam once again becomes a primary media subject.`
},
{
    dates: [ start(2014), end(2015) ],
    content:`<span class="bold underline">2014 – 2015​: Islamic State and attacks in Europe.</span>

    The spectacular rise of the **Islamic State** organisation (IS), given wide media coverage due to their extreme violence, begins this period. The regionalisation and then internationalisation of the Iraq-Syria conflict is given extension media coverage. Above all, the **attacks** perpetrated in France and the West, followed by the resurgence of the **refugee crisis** (2015), revive widespread debate on Islam and violence and, by extension, on the “**Muslim problem**” in France and the West.`
}
];
