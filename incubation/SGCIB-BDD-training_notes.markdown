BDD in practice :

Why-a-feature
-------------

Critiquons ensemble !
* Répétition : on a voulu faire du remplissage. intention différente de la façon de le faire
* Grand classique : afin de X je veux X
* Peut-on implémenter comme ça ? Oui, mais non. Dans un contexte comptable on favorise la précision, dans un contexte de trading haute fréquence on favorise la vitesse
* Exprimer une vraie solution : poser des questions à ceux qui savent vraiment. Proposer (parier) des intentions, et vérifier avec ceux qui savent vraiment

Find-a-narrative
----------------
Sur un site marchand en ligne, valider les commandes... Pourquoi faire ?
* Proposer des intentions / contexte [open bar, pas de règle, selon votre imagination]

Examples:
 - as a customer, in order to get the status of my order
 - availability and date
 - as a buyer, in order to validate the basket of chosen items, I want to input the bank details
 - in order to pay by credit card, as a connected client, I want the login and email
 - in order to validate the basket, ... I want secure payment
 - stock, inventaire, credit check

D'autres idées ? Différentes idées, la preuve qu'en l'absence de contexte on peut imaginer à peu près ce qu'on veut, pour le pire ou le meilleur

"test" -> "spec" -> "example"

Find key examples
-----------------
2mn... abstract descriptions... et pourquoi pas des exemples concrets ?
(prêter le pointeur laser pour montrer du doigt sur le sketch)
On s'en fout de la bonne réponse. L'important c'est la démarche. Pas le même vocabulaire.
Pas seulement texte, visuel aussi. Penser au visuel.

sketch -> algorithme pour énumérer les cas possibles.
Vos exemples montrent des façons de penser différentes, d'où l'intérêt d'être plusieurs pour construire une spécification.

Happy Hour
----------

Langage qui émerge
Choix de ce qu'on fixe concrètement et de ce qu'on laisse implicite
On veut controler l'environnement et le jeu de données. L'idéal est de faire générer le jeu de données par le scénario. Sinon on injecte un jeu de données, à défaut de mieux.

Personas pour les scénarios
Exemple tableau happy hour en fonction de l'heure (TODO?)
Séparer les cas nominaux / corner / error







