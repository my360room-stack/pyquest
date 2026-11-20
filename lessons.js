// Contenu du cours. Types d'exercices :
//  mc    : question à choix (c = index de la bonne réponse dans a)
//  fill  : code avec des trous ___ ; ans = réponses dans l'ordre ; bank = étiquettes proposées
//  order : remettre les lignes dans l'ordre (lines = ordre correct)
//  type  : taper la réponse ; ans = réponses acceptées
window.COURSE = [
  {
    title: "Premiers pas", icon: "👋", color: "#3b82f6",
    tip: "<b>print()</b> affiche ce qu'on lui donne.<br><code>print(\"Bonjour\")</code> → Bonjour<br><br>Le texte s'écrit entre guillemets. Les nombres non.<br>Une ligne qui commence par <b>#</b> est un commentaire : Python l'ignore.",
    ex: [
      { t: "mc", q: "Quelle instruction affiche un message à l'écran ?", a: ['print("Salut")', 'echo "Salut"', 'console.log("Salut")', 'say("Salut")'], c: 0, mono: true, why: "En Python, on utilise la fonction print()." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'print("Bonjour !")', a: ["Bonjour !", '"Bonjour !"', "print Bonjour !", "Rien"], c: 0, why: "Les guillemets délimitent le texte, ils ne s'affichent pas." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "print(2 + 3)", a: ["5", "2 + 3", "23", "Erreur"], c: 0, why: "Sans guillemets, 2 + 3 est un calcul : Python affiche le résultat." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'print("2" + "3")', a: ["23", "5", "2 + 3", "Erreur"], c: 0, why: "Entre guillemets ce sont des textes : + les colle l'un à l'autre." },
      { t: "fill", q: "Complète pour afficher le message", code: '___("Python, c\'est cool")', bank: ["print", "input", "show", "len"], ans: ["print"] },
      { t: "mc", q: "Comment écrire un commentaire en Python ?", a: ["# mon commentaire", "// mon commentaire", "<!-- mon commentaire -->", "-- mon commentaire"], c: 0, mono: true, why: "En Python, tout ce qui suit # sur une ligne est ignoré." },
      { t: "type", q: "Écris l'instruction qui affiche : Hello", ans: ['print("Hello")'], hint: 'print(...)' },
      { t: "order", q: "Remets le programme dans l'ordre pour afficher 1, puis 2, puis 3", lines: ['print("1")', 'print("2")', 'print("3")'] }
    ]
  },
  {
    title: "Variables", icon: "📦", color: "#8b5cf6",
    tip: "Une <b>variable</b> est une boîte avec un nom.<br><code>age = 12</code> range 12 dans la boîte <b>age</b>.<br><br>Le signe <b>=</b> veut dire « ranger », pas « est égal ».<br>Noms valides : lettres, chiffres, <b>_</b>, sans espace, sans commencer par un chiffre.",
    ex: [
      { t: "mc", q: "Que fait cette ligne ?", code: "age = 12", a: ["Elle range 12 dans la variable age", "Elle vérifie si age vaut 12", "Elle affiche 12", "Elle provoque une erreur"], c: 0, why: "= sert à affecter une valeur à une variable." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "x = 5\nx = x + 2\nprint(x)", a: ["7", "5", "x + 2", "52"], c: 0, why: "x vaut 5, puis on lui ajoute 2 : 7." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'nom = "Léa"\nprint("Salut " + nom)', a: ["Salut Léa", "Salut nom", "Salut + nom", '"Salut Léa"'], c: 0, why: "nom est remplacé par sa valeur, \"Léa\"." },
      { t: "mc", q: "Quel nom de variable est valide ?", a: ["mon_score", "2score", "mon-score", "mon score"], c: 0, mono: true, why: "Pas de tiret, pas d'espace, et pas de chiffre au début." },
      { t: "fill", q: "Complète pour ranger 10 dans score", code: "score ___ 10\nprint(score)", bank: ["=", "==", ":", "->"], ans: ["="] },
      { t: "mc", q: "Qu'affiche ce code ?", code: "a = 3\nb = a\na = 10\nprint(b)", a: ["3", "10", "a", "13"], c: 0, why: "b a reçu une copie de la valeur 3. Changer a ensuite ne change pas b." },
      { t: "order", q: "Remets dans l'ordre pour afficher « Bonjour Sam »", lines: ['prenom = "Sam"', 'message = "Bonjour " + prenom', "print(message)"] },
      { t: "type", q: "Que vaut x à la fin ? Tape juste le nombre.", code: "x = 4\nx = x * 3\nx = x - 2", ans: ["10"] }
    ]
  },
  {
    title: "Nombres & types", icon: "🔢", color: "#10b981",
    tip: "Types de base :<br><b>int</b> (entier) 7 · <b>float</b> (décimal) 3.5 · <b>str</b> (texte) \"hi\" · <b>bool</b> True / False<br><br>Opérateurs :<br><code>/</code> division · <code>//</code> division entière · <code>%</code> reste · <code>**</code> puissance",
    ex: [
      { t: "mc", q: "Qu'affiche ce code ?", code: "print(7 / 2)", a: ["3.5", "3", "4", "3.0"], c: 0, why: "/ donne toujours une division décimale." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "print(7 // 2)", a: ["3", "3.5", "4", "1"], c: 0, why: "// garde uniquement la partie entière." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "print(7 % 2)", a: ["1", "3", "3.5", "0"], c: 0, why: "% donne le reste : 7 = 2×3 + 1." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "print(2 ** 3)", a: ["8", "6", "9", "23"], c: 0, why: "** est la puissance : 2 × 2 × 2 = 8." },
      { t: "mc", q: "Quel est le type de 3.14 ?", a: ["float", "int", "str", "bool"], c: 0, mono: true, why: "Un nombre à virgule est un float." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'print(int("4") + 1)', a: ["5", "41", "\"41\"", "Erreur"], c: 0, why: "int() transforme le texte \"4\" en nombre 4." },
      { t: "mc", q: "Laquelle de ces valeurs est un booléen ?", a: ["True", '"True"', "1.0", "'vrai'"], c: 0, mono: true, why: "True et False (avec majuscule, sans guillemets) sont les booléens." },
      { t: "type", q: "Combien vaut 10 % 3 ? Tape le résultat.", ans: ["1"] }
    ]
  },
  {
    title: "Textes", icon: "🔤", color: "#f59e0b",
    tip: "Un texte (str) est une suite de caractères numérotés à partir de <b>0</b>.<br><code>mot[0]</code> premier · <code>mot[-1]</code> dernier · <code>mot[1:4]</code> du 1 au 3<br><code>len(mot)</code> longueur · <code>mot.upper()</code> majuscules<br>f-string : <code>f\"J'ai {age} ans\"</code>",
    ex: [
      { t: "mc", q: "Qu'affiche ce code ?", code: 'print(len("chat"))', a: ["4", "3", "5", "chat"], c: 0, why: "len() compte les caractères : c-h-a-t = 4." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'mot = "python"\nprint(mot[0])', a: ["p", "y", "python", "n"], c: 0, why: "Les positions commencent à 0." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'mot = "python"\nprint(mot[-1])', a: ["n", "p", "o", "Erreur"], c: 0, why: "-1 désigne le dernier caractère." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'print("ha" * 3)', a: ["hahaha", "ha3", "ha ha ha", "Erreur"], c: 0, why: "Multiplier un texte le répète." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'print("bonjour".upper())', a: ["BONJOUR", "Bonjour", "bonjour", "bONJOUR"], c: 0, why: "upper() met tout en majuscules." },
      { t: "fill", q: "Complète pour créer une f-string", code: 'nom = "Zoé"\nage = 11\nprint(___"{nom} a {age} ans")', bank: ["f", "s", "r", "$"], ans: ["f"] },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'mot = "python"\nprint(mot[1:4])', a: ["yth", "pyt", "ytho", "pyth"], c: 0, why: "[1:4] prend les positions 1, 2 et 3 (le 4 est exclu)." },
      { t: "type", q: "Qu'affiche ce code ? Tape la réponse.", code: 'print("Py" + "thon")', ans: ["Python"] }
    ]
  },
  {
    title: "Conditions", icon: "🔀", color: "#ef4444",
    tip: "<code>if</code> condition<b>:</b> → bloc indenté (4 espaces)<br><code>elif</code> autre condition<b>:</b><br><code>else:</code> sinon<br><br>Comparaisons : <code>== != &lt; &gt; &lt;= &gt;=</code><br>Combiner : <code>and</code>, <code>or</code>, <code>not</code>",
    ex: [
      { t: "mc", q: "Qu'affiche ce code ?", code: "print(5 > 3)", a: ["True", "False", "5", "Erreur"], c: 0, why: "Une comparaison donne un booléen : 5 est bien plus grand que 3." },
      { t: "mc", q: "Quel opérateur teste l'égalité ?", a: ["==", "=", "===", ":="], c: 0, mono: true, why: "== compare, = affecte." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'x = 8\nif x > 10:\n    print("grand")\nelse:\n    print("petit")', a: ["petit", "grand", "grand\npetit", "Rien"], c: 0, why: "8 n'est pas plus grand que 10 : on passe dans le else." },
      { t: "fill", q: "Complète la condition", code: 'age = 15\n___ age >= 18:\n    print("majeur")\n___:\n    print("mineur")', bank: ["if", "else", "elif", "for", "then"], ans: ["if", "else"] },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'n = 0\nif n > 0:\n    print("positif")\nelif n == 0:\n    print("zéro")\nelse:\n    print("négatif")', a: ["zéro", "positif", "négatif", "positif\nzéro"], c: 0, why: "n > 0 est faux, mais n == 0 est vrai." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "print(True and False)", a: ["False", "True", "None", "Erreur"], c: 0, why: "and n'est vrai que si les deux côtés sont vrais." },
      { t: "mc", q: "Qu'est-ce qui manque dans ce code ?", code: "if x > 3\n    print(x)", a: ["Les deux-points : après la condition", "Des parenthèses autour de x", "Un point-virgule à la fin", "Rien, il est correct"], c: 0, why: "Une ligne if se termine toujours par :" },
      { t: "order", q: "Remets dans l'ordre", lines: ["note = 15", "if note >= 10:", '    print("Réussi !")', "else:", '    print("Raté")'] }
    ]
  },
  {
    title: "Listes", icon: "📋", color: "#06b6d4",
    tip: "Une <b>liste</b> range plusieurs valeurs : <code>nums = [4, 8, 15]</code><br><code>nums[0]</code> premier élément<br><code>len(nums)</code> taille · <code>nums.append(16)</code> ajouter<br><code>nums.sort()</code> trier · <code>sum(nums)</code> total",
    ex: [
      { t: "mc", q: "Qu'affiche ce code ?", code: 'fruits = ["pomme", "kiwi", "mangue"]\nprint(fruits[1])', a: ["kiwi", "pomme", "mangue", "Erreur"], c: 0, why: "L'indice 1 est le 2e élément (on compte depuis 0)." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "nums = [4, 8, 15]\nprint(len(nums))", a: ["3", "27", "15", "2"], c: 0, why: "La liste contient 3 éléments." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "nums = [1, 2]\nnums.append(3)\nprint(nums)", a: ["[1, 2, 3]", "[3, 1, 2]", "[1, 2]", "3"], c: 0, why: "append() ajoute à la fin." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "nums = [10, 20, 30]\nprint(nums[-1])", a: ["30", "10", "20", "Erreur"], c: 0, why: "-1 désigne le dernier élément." },
      { t: "fill", q: "Ajoute « lapin » à la liste", code: 'animaux = ["chat", "chien"]\nanimaux.___("lapin")', bank: ["append", "add", "push", "plus"], ans: ["append"] },
      { t: "mc", q: "Qu'affiche ce code ?", code: "nums = [3, 1, 2]\nnums.sort()\nprint(nums)", a: ["[1, 2, 3]", "[3, 2, 1]", "[3, 1, 2]", "None"], c: 0, why: "sort() trie la liste dans l'ordre croissant." },
      { t: "mc", q: "Quel est l'indice du premier élément d'une liste ?", a: ["0", "1", "-1", "Ça dépend"], c: 0, why: "En Python on compte toujours à partir de 0." },
      { t: "type", q: "Qu'affiche ce code ? Tape le résultat.", code: "print(sum([1, 2, 3, 4]))", ans: ["10"] }
    ]
  },
  {
    title: "Boucles", icon: "🔁", color: "#ec4899",
    tip: "<code>for i in range(3):</code> → i vaut 0, 1, 2<br><code>range(2, 8, 2)</code> → 2, 4, 6<br><code>for x in liste:</code> parcourt la liste<br><code>while condition:</code> répète tant que c'est vrai<br><code>break</code> sort de la boucle",
    ex: [
      { t: "mc", q: "Qu'affiche ce code ?", code: "for i in range(3):\n    print(i)", a: ["0\n1\n2", "1\n2\n3", "0\n1\n2\n3", "3"], c: 0, why: "range(3) va de 0 à 2 : le 3 est exclu." },
      { t: "mc", q: "Combien de fois « Hop » est-il affiché ?", code: 'for i in range(5):\n    print("Hop")', a: ["5", "4", "6", "0"], c: 0, why: "range(5) produit 5 valeurs : 0 à 4." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "total = 0\nfor n in [1, 2, 3]:\n    total = total + n\nprint(total)", a: ["6", "3", "123", "0"], c: 0, why: "0 + 1 + 2 + 3 = 6." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1", a: ["3\n2\n1", "3\n2\n1\n0", "1\n2\n3", "Une boucle infinie"], c: 0, why: "Quand n arrive à 0, la condition n > 0 devient fausse." },
      { t: "fill", q: "Complète pour parcourir chaque lettre", code: 'for lettre ___ "abc":\n    print(lettre)', bank: ["in", "of", "on", "="], ans: ["in"] },
      { t: "mc", q: "Qu'affiche ce code ?", code: "for i in range(2, 8, 2):\n    print(i)", a: ["2\n4\n6", "2\n4\n6\n8", "2\n8", "4\n6\n8"], c: 0, why: "On part de 2, on avance de 2, et on s'arrête avant 8." },
      { t: "mc", q: "Quel mot arrête immédiatement une boucle ?", a: ["break", "stop", "exit", "continue"], c: 0, mono: true, why: "break sort de la boucle ; continue passe juste au tour suivant." },
      { t: "order", q: "Remets dans l'ordre pour afficher la somme 1 + 2 + 3", lines: ["total = 0", "for i in range(1, 4):", "    total = total + i", "print(total)"] }
    ]
  },
  {
    title: "Fonctions", icon: "🧩", color: "#6366f1",
    tip: "<code>def nom(param):</code> crée une fonction<br><code>return valeur</code> renvoie un résultat<br>On l'appelle avec <code>nom(valeur)</code><br><br>Paramètre par défaut : <code>def f(a, b=10):</code><br>Une fonction jamais appelée ne s'exécute pas !",
    ex: [
      { t: "mc", q: "Quel mot-clé crée une fonction ?", a: ["def", "function", "func", "fn"], c: 0, mono: true, why: "def vient de « define » (définir)." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "def double(x):\n    return x * 2\n\nprint(double(4))", a: ["8", "4", "x * 2", "Rien"], c: 0, why: "double(4) renvoie 4 × 2 = 8." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'def salut(nom):\n    print("Salut " + nom)\n\nsalut("Max")', a: ["Salut Max", "Salut nom", "Max", "Rien"], c: 0, why: "Le paramètre nom reçoit la valeur \"Max\"." },
      { t: "fill", q: "Complète pour que la fonction renvoie le carré", code: "def carre(n):\n    ___ n * n", bank: ["return", "print", "give", "send"], ans: ["return"] },
      { t: "mc", q: "Qu'affiche ce code ?", code: "def f(a, b=10):\n    return a + b\n\nprint(f(5))", a: ["15", "5", "510", "Erreur"], c: 0, why: "b n'est pas donné, il prend sa valeur par défaut : 10." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'def f():\n    print("A")\n\nprint("B")', a: ["B", "A\nB", "B\nA", "A"], c: 0, why: "La fonction f est définie mais jamais appelée." },
      { t: "type", q: "Que renvoie max(3, 9, 4) ? Tape le résultat.", ans: ["9"] },
      { t: "order", q: "Remets dans l'ordre pour afficher 12", lines: ["def aire(l, h):", "    return l * h", "print(aire(3, 4))"] }
    ]
  },
  {
    title: "Dictionnaires", icon: "📖", color: "#14b8a6",
    tip: "Un <b>dictionnaire</b> associe des <b>clés</b> à des <b>valeurs</b> :<br><code>ages = {\"Léo\": 10, \"Ana\": 12}</code><br><code>ages[\"Ana\"]</code> → 12<br><code>ages[\"Tom\"] = 9</code> ajoute<br><code>\"Léo\" in ages</code> → True<br><code>ages.get(\"Zed\", 0)</code> → 0 si absent",
    ex: [
      { t: "mc", q: "Qu'affiche ce code ?", code: 'ages = {"Léo": 10, "Ana": 12}\nprint(ages["Ana"])', a: ["12", "10", "Ana", "Erreur"], c: 0, why: "On récupère la valeur associée à la clé \"Ana\"." },
      { t: "mc", q: "Dans {\"a\": 1}, comment s'appelle \"a\" ?", a: ["La clé", "La valeur", "L'indice", "Le type"], c: 0, why: "\"a\" est la clé, 1 est la valeur." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'd = {"x": 1}\nd["y"] = 2\nprint(len(d))', a: ["2", "1", "3", "Erreur"], c: 0, why: "On a ajouté une 2e clé \"y\"." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'd = {"chat": "miaou"}\nprint("chat" in d)', a: ["True", "False", "miaou", "Erreur"], c: 0, why: "in vérifie si la clé existe." },
      { t: "fill", q: "Change le stock de pommes à 8", code: 'stock = {"pommes": 5}\nstock[___] = 8', bank: ['"pommes"', "pommes", "5", "0"], ans: ['"pommes"'] },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'd = {"a": 1, "b": 2}\nfor k in d:\n    print(k)', a: ["a\nb", "1\n2", "('a', 1)\n('b', 2)", "Erreur"], c: 0, why: "Parcourir un dictionnaire donne ses clés." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'd = {"a": 1}\nprint(d.get("z", 0))', a: ["0", "None", "Erreur", "z"], c: 0, why: "get() renvoie la valeur par défaut si la clé n'existe pas." },
      { t: "type", q: "Qu'affiche ce code ? Tape le résultat.", code: 'notes = {"maths": 14, "info": 18}\nprint(notes["info"] - notes["maths"])', ans: ["4"] }
    ]
  },
  {
    title: "Erreurs", icon: "🛟", color: "#f97316",
    tip: "Les erreurs les plus courantes :<br><b>NameError</b> variable inconnue · <b>TypeError</b> mauvais type (\"a\" + 1)<br><b>ValueError</b> valeur invalide (int(\"abc\")) · <b>IndexError</b> indice hors liste<br><b>KeyError</b> clé absente · <b>ZeroDivisionError</b> division par 0<br><br>On les attrape avec :<br><code>try:</code> code risqué<br><code>except ValueError:</code> plan B",
    ex: [
      { t: "mc", q: "Quelle erreur provoque ce code ?", code: "print(10 / 0)", a: ["ZeroDivisionError", "ValueError", "TypeError", "Aucune erreur"], c: 0, why: "Diviser par zéro est impossible." },
      { t: "mc", q: "Quelle erreur provoque ce code ?", code: "nums = [1, 2, 3]\nprint(nums[5])", a: ["IndexError", "KeyError", "ValueError", "NameError"], c: 0, why: "La liste n'a que les indices 0, 1 et 2." },
      { t: "mc", q: "Quelle erreur provoque ce code ?", code: 'print("Age : " + 12)', a: ["TypeError", "NameError", "ValueError", "SyntaxError"], c: 0, why: "On ne peut pas coller un texte et un nombre. Il faut écrire str(12)." },
      { t: "mc", q: "Quelle erreur provoque ce code ?", code: "score = 5\nprint(scor)", a: ["NameError", "TypeError", "IndexError", "Aucune erreur"], c: 0, why: "La variable scor n'existe pas : c'est une faute de frappe." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'try:\n    x = int("abc")\nexcept ValueError:\n    x = 0\nprint(x)', a: ["0", "abc", "Erreur", "None"], c: 0, why: "int(\"abc\") échoue, donc on passe dans le except qui met x à 0." },
      { t: "fill", q: "Complète pour attraper l'erreur", code: '___:\n    print(1 / 0)\n___ ZeroDivisionError:\n    print("Impossible")', bank: ["try", "except", "catch", "error", "if"], ans: ["try", "except"] },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'try:\n    print("A")\nexcept:\n    print("B")\nprint("C")', a: ["A\nC", "A\nB\nC", "B\nC", "A"], c: 0, why: "Aucune erreur dans le try : le except est sauté." },
      { t: "type", q: "Écris l'expression qui transforme le nombre 12 en texte", ans: ["str(12)"], hint: "str(...)" }
    ]
  },
  {
    title: "Listes avancées", icon: "✨", color: "#65a30d",
    tip: "<b>Compréhension de liste</b> :<br><code>[x * 2 for x in nums]</code> → chaque élément doublé<br><code>[x for x in nums if x &gt; 0]</code> → avec un filtre<br><br><code>nums[1:3]</code> une tranche · <code>3 in nums</code> test<br><code>enumerate(liste)</code> donne (indice, valeur)<br>Un <b>tuple</b> <code>(1, 2)</code> est une liste non modifiable.",
    ex: [
      { t: "mc", q: "Qu'affiche ce code ?", code: "nums = [1, 2, 3]\nprint([x * 2 for x in nums])", a: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "12", "Erreur"], c: 0, why: "La compréhension applique x * 2 à chaque élément." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "print([x for x in range(6) if x % 2 == 0])", a: ["[0, 2, 4]", "[2, 4, 6]", "[1, 3, 5]", "[0, 2, 4, 6]"], c: 0, why: "range(6) va de 0 à 5, et on garde les nombres pairs." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'lettres = ["a", "b", "c", "d"]\nprint(lettres[1:3])', a: ["['b', 'c']", "['a', 'b', 'c']", "['b', 'c', 'd']", "['a', 'b']"], c: 0, why: "[1:3] prend les indices 1 et 2." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "print(3 in [1, 2, 3])", a: ["True", "False", "3", "2"], c: 0, why: "in vérifie si la valeur est dans la liste." },
      { t: "mc", q: "Quelle est la différence entre une liste et un tuple ?", a: ["Un tuple ne peut pas être modifié", "Un tuple ne contient que des nombres", "Un tuple n'a pas d'indices", "Aucune différence"], c: 0, why: "Un tuple est figé : pas d'append, pas de modification." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'for i, f in enumerate(["kiwi", "pomme"]):\n    print(i, f)', a: ["0 kiwi\n1 pomme", "1 kiwi\n2 pomme", "kiwi\npomme", "0\n1"], c: 0, why: "enumerate donne l'indice (à partir de 0) et la valeur." },
      { t: "fill", q: "Complète pour créer la liste des carrés", code: "carres = [n * n ___ n ___ range(4)]", bank: ["for", "in", "if", "while", "of"], ans: ["for", "in"] },
      { t: "mc", q: "Qu'affiche ce code ?", code: "print(sorted([3, 1, 2], reverse=True))", a: ["[3, 2, 1]", "[1, 2, 3]", "[3, 1, 2]", "None"], c: 0, why: "reverse=True trie dans l'ordre décroissant." }
    ]
  },
  {
    title: "Modules", icon: "🧰", color: "#0284c7",
    tip: "Un <b>module</b> apporte des outils prêts à l'emploi :<br><code>import math</code> puis <code>math.sqrt(16)</code><br><code>from random import randint</code> puis <code>randint(1, 6)</code><br><code>random.choice(liste)</code> élément au hasard<br><br>Sans import : <code>round(3.14159, 2)</code>, <code>abs(-7)</code>",
    ex: [
      { t: "mc", q: "Quelle ligne charge le module math ?", a: ["import math", "include math", "using math", 'require("math")'], c: 0, mono: true, why: "En Python, on charge un module avec import." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "import math\nprint(math.sqrt(16))", a: ["4.0", "4", "16", "8.0"], c: 0, why: "sqrt (racine carrée) renvoie toujours un float." },
      { t: "mc", q: "Quelles valeurs n peut-il prendre ?", code: "from random import randint\nn = randint(1, 6)", a: ["Un entier de 1 à 6 (6 inclus)", "Un entier de 1 à 5", "Un décimal entre 1 et 6", "Toujours 1"], c: 0, why: "randint inclut les deux bornes, comme un dé." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "print(round(3.14159, 2))", a: ["3.14", "3.1", "3", "3.142"], c: 0, why: "round(x, 2) garde 2 chiffres après la virgule." },
      { t: "fill", q: "Complète pour importer seulement pi", code: "___ math ___ pi\nprint(pi)", bank: ["from", "import", "as", "use"], ans: ["from", "import"] },
      { t: "mc", q: "Qu'affiche ce code ?", code: "import math\nprint(math.floor(4.7))", a: ["4", "5", "4.7", "4.0"], c: 0, why: "floor arrondit vers le bas et renvoie un entier." },
      { t: "mc", q: 'Que fait random.choice(["pile", "face"]) ?', a: ["Il choisit un élément au hasard", "Il renvoie toujours \"pile\"", "Il mélange la liste", "Il renvoie la taille de la liste"], c: 0, why: "choice tire un élément au hasard dans la liste." },
      { t: "type", q: "Qu'affiche ce code ? Tape le résultat.", code: "print(abs(-7))", ans: ["7"] }
    ]
  },
  {
    title: "Objets & classes", icon: "🏗️", color: "#9333ea",
    tip: "Une <b>classe</b> est un plan pour fabriquer des objets :<br><code>class Chien:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;def __init__(self, nom):</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.nom = nom</code><br><br><code>rex = Chien(\"Rex\")</code> crée un objet<br><code>rex.nom</code> → \"Rex\"<br><b>self</b> désigne l'objet lui-même.",
    ex: [
      { t: "mc", q: "Quel mot-clé crée une classe ?", a: ["class", "object", "struct", "def"], c: 0, mono: true, why: "class définit un nouveau type d'objet." },
      { t: "mc", q: "Qu'affiche ce code ?", code: 'class Chat:\n    def __init__(self, nom):\n        self.nom = nom\n\nc = Chat("Mimi")\nprint(c.nom)', a: ["Mimi", "nom", "Chat", "self.nom"], c: 0, why: "__init__ a rangé \"Mimi\" dans self.nom." },
      { t: "mc", q: "À quoi sert __init__ ?", a: ["À initialiser l'objet quand on le crée", "À supprimer l'objet", "À afficher l'objet", "À importer la classe"], c: 0, why: "__init__ s'exécute automatiquement à la création." },
      { t: "mc", q: "Qu'affiche ce code ?", code: "class Compteur:\n    def __init__(self):\n        self.n = 0\n    def plus(self):\n        self.n = self.n + 1\n\nc = Compteur()\nc.plus()\nc.plus()\nprint(c.n)", a: ["2", "0", "1", "Erreur"], c: 0, why: "On part de 0 et on appelle plus() deux fois." },
      { t: "fill", q: "Complète la méthode", code: 'class Chien:\n    def aboyer(___):\n        print("Wouf")', bank: ["self", "this", "me", "chien"], ans: ["self"] },
      { t: "mc", q: "Qu'affiche ce code ?", code: "class Rect:\n    def __init__(self, l, h):\n        self.l = l\n        self.h = h\n    def aire(self):\n        return self.l * self.h\n\nr = Rect(3, 5)\nprint(r.aire())", a: ["15", "8", "35", "Erreur"], c: 0, why: "aire() renvoie 3 × 5." },
      { t: "mc", q: "Dans r = Rect(3, 5), qu'est-ce que r ?", a: ["Un objet (une instance) de Rect", "Une fonction", "Une liste", "Le nom de la classe"], c: 0, why: "Appeler la classe fabrique un objet." },
      { t: "order", q: "Remets dans l'ordre pour afficher « Cui cui »", lines: ["class Oiseau:", "    def chanter(self):", '        print("Cui cui")', "o = Oiseau()", "o.chanter()"] }
    ]
  }
];
