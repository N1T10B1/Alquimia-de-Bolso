#!/usr/bin/env python3
"""Gera os MIDIs da trilha de Alquimia de Bolso (estilo 'Renascença de bolso')."""
import struct, sys, os, random

PPQ = 480
E = PPQ // 2  # colcheia
OUT = sys.argv[1]
random.seed(7)

NOTE = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def n(s):
    s = s.strip(); name = s[0]; i = 1; acc = 0
    while i < len(s) and s[i] in '#b':
        acc += 1 if s[i] == '#' else -1; i += 1
    return 12 * (int(s[i:]) + 1) + NOTE[name] + acc

def vlq(x):
    b = [x & 0x7F]; x >>= 7
    while x: b.insert(0, (x & 0x7F) | 0x80); x >>= 7
    return bytes(b)

class Track:
    def __init__(self, name, ch, program=None, vol=100, pan=64, rev=40, cc=True):
        self.name, self.ch, self.ev = name, ch, []
        nb = name.encode('latin-1')
        self.ev.append((0, 0, b'\xff\x03' + vlq(len(nb)) + nb))
        if program is not None:
            self.ev.append((0, 1, bytes([0xC0 | ch, program])))
        for cc_, v in (((7, vol), (10, pan), (91, rev)) if cc else ()):
            self.ev.append((0, 1, bytes([0xB0 | ch, cc_, v])))
    def note(self, t, pitch, dur, vel):
        if isinstance(pitch, str): pitch = n(pitch)
        vel = max(1, min(127, int(vel)))
        self.ev.append((t, 3, bytes([0x90 | self.ch, pitch, vel])))
        self.ev.append((t + max(1, dur - 10), 2, bytes([0x80 | self.ch, pitch, 0])))
    def meta(self, t, data): self.ev.append((t, 0, data))
    def marker(self, t, txt):
        b = txt.encode('latin-1'); self.meta(t, b'\xff\x06' + vlq(len(b)) + b)
    def bytes(self):
        out = b''; last = 0
        for t, _, d in sorted(self.ev, key=lambda e: (e[0], e[1])):
            out += vlq(t - last) + d; last = t
        out += b'\x00\xff\x2f\x00'
        return b'MTrk' + struct.pack('>I', len(out)) + out

def save(fname, tracks):
    data = b'MThd' + struct.pack('>IHHH', 6, 1, len(tracks), PPQ)
    for tr in tracks: data += tr.bytes()
    with open(os.path.join(OUT, fname), 'wb') as f: f.write(data)
    print('ok', fname, len(data), 'bytes')

def conductor(title, bpm, num, den, markers, copyright='Alquimia de Bolso'):
    tr = Track(title, 0, cc=False)
    us = int(60_000_000 / bpm)
    tr.meta(0, b'\xff\x51\x03' + us.to_bytes(3, 'big'))
    dd = {2: 1, 4: 2, 8: 3}[den]
    clocks = 36 if den == 8 else 24
    tr.meta(0, bytes([0xff, 0x58, 4, num, dd, clocks, 8]))
    c = copyright.encode(); tr.meta(0, b'\xff\x02' + vlq(len(c)) + c)
    for t, m in markers: tr.marker(t, m)
    return tr

def hum(v, a=6): return v + random.randint(-a, a)

# acordes: fundamental + terça + quinta (nomes sem oitava)
CH = {
 'Dm': ('D','F','A'), 'C': ('C','E','G'), 'Am': ('A','C','E'), 'F': ('F','A','C'),
 'G': ('G','B','D'), 'A': ('A','C#','E'), 'Bb': ('Bb','D','F'), 'Em': ('E','G','B'),
 'D': ('D','F#','A'), 'Asus': ('A','D','E'),
}
def p(name, octv): return n(name + str(octv))
def tri(ch, octv):
    r, th, f = CH[ch]; root = p(r, octv)
    third = p(th, octv) if p(th, octv) > root else p(th, octv + 1)
    fifth = p(f, octv) if p(f, octv) > root else p(f, octv + 1)
    return root, third, fifth

def play_melody(tr, start, bars_notes, bar_len, vel=88, oct_shift=0):
    t = start
    for bar in bars_notes:
        bt = t
        for note, d in bar:
            if note != 'r':
                accent = 8 if (bt - t) % (3 * E) == 0 else 0
                tr.note(bt, n(note) + 12 * oct_shift, d * E, hum(vel + accent - 4))
            bt += d * E
        assert bt - t == bar_len, (bar, bt - t)
        t += bar_len
    return t

# =====================================================================
# 1) TEMA DO MENU  "O Caderno da Boticária"  Ré dórico, 3/4, 80 bpm
# =====================================================================
def tema_menu():
    BAR = 6 * E
    A_prog = ['Dm','C','Dm','Am','F','C','G','A']
    B_prog = ['F','C','Dm','Am','Bb','F','G','A']
    melA = [
        [('D5',2),('E5',1),('F5',1),('A5',2)],
        [('G5',3),('F5',1),('E5',2)],
        [('F5',2),('E5',1),('D5',1),('E5',2)],
        [('C5',4),('A4',2)],
        [('A4',2),('C5',1),('D5',1),('F5',2)],
        [('E5',2),('G5',2),('E5',1),('C5',1)],
        [('D5',3),('B4',1),('C5',1),('D5',1)],
        [('E5',3),('D5',1),('C#5',2)],
    ]
    melA_fim = melA[:7] + [[('D5',6)]]
    melB = [
        [('A5',2),('C6',2),('A5',1),('G5',1)],
        [('G5',2),('E5',2),('C5',2)],
        [('F5',3),('E5',1),('D5',2)],
        [('E5',4),('C5',2)],
        [('D5',2),('F5',2),('Bb5',2)],
        [('A5',3),('G5',1),('F5',2)],
        [('G5',2),('F5',1),('E5',1),('D5',2)],
        [('C#5',2),('E5',2),('A5',2)],
    ]
    # contracanto da viola da gamba na parte B (graves)
    gambaB = [
        [('F3',2),('A3',2),('C4',2)],
        [('E3',2),('G3',2),('C4',2)],
        [('D3',2),('F3',2),('A3',2)],
        [('A2',2),('C3',2),('E3',2)],
        [('Bb2',2),('D3',2),('F3',2)],
        [('A2',2),('C3',2),('F3',2)],
        [('G2',2),('B2',2),('D3',2)],
        [('A2',3),('G2',1),('E2',2)],
    ]
    INTRO, SA, SB, SA2, OUTRO = 0, 4*BAR, 12*BAR, 20*BAR, 28*BAR
    END = 32*BAR
    cond = conductor('Tema do Menu - O Caderno da Boticaria', 80, 3, 4,
        [(INTRO,'Intro'),(SA,'A - flauta doce'),(SB,'B - gamba responde'),
         (SA2,'A2 - todos'),(OUTRO,'Fim / ponto de loop'),(END,'Loop')])

    flauta = Track('Flauta doce contralto (Recorder)', 0, 74, 100, 70, 50)
    alaude = Track('Alaude (Nylon Guitar)', 1, 24, 96, 50, 45)
    gamba  = Track('Viola da gamba (Cello)', 2, 42, 92, 78, 45)
    cravo  = Track('Cravo (Harpsichord)', 3, 6, 72, 90, 40)
    bordao = Track('Bordao de sanfona (String Ensemble)', 4, 48, 60, 64, 60)
    celesta= Track('Brilho magico (Celesta)', 5, 8, 70, 100, 80)
    perc   = Track('Percussao de mao (canal 10)', 9, None, 80, 60, 30)

    def arpejo(t, ch, v=70, octv=3):
        root, third, fifth = tri(ch, octv)
        notes = [root, fifth, root + 12, third + 12, fifth + 12, third + 12]
        for i, x in enumerate(notes):
            alaude.note(t + i * E, x, E * 2 if i == 0 else E + E // 2, hum(v + (10 if i == 0 else 0)))

    def baixo(t, ch, v=78):
        root = tri(ch, 2)[0]
        if root < n('D2'): root += 12
        gamba.note(t, root, BAR - E, hum(v))

    def cravo_comp(t, ch, v=62):
        for beat in (1, 2):
            for x in tri(ch, 4):
                cravo.note(t + beat * 2 * E + random.randint(0, 12), x, E + E//2, hum(v))

    def perc_bar(t, forte=False):
        perc.note(t, 61, E, hum(70 if forte else 58))          # bongô grave (tambor de mão)
        perc.note(t + 4 * E, 60, E, hum(48))                  # bongô agudo
        if forte:
            perc.note(t + 2 * E, 54, E, hum(42))              # pandeirola
            perc.note(t + 5 * E, 54, E, hum(36))

    # Intro: bordão + alaúde
    bordao.note(INTRO, n('D2'), 4*BAR - E, 55); bordao.note(INTRO, n('A2'), 4*BAR - E, 50)
    for i, ch in enumerate(['Dm','C','Dm','Asus']):
        arpejo(INTRO + i*BAR, ch, 64)
    perc.note(INTRO + 3*BAR + 4*E, 81, 2*E, 50)  # triângulo abrindo o tema

    # A: flauta + alaúde + gamba
    play_melody(flauta, SA, melA, BAR, 86)
    for i, ch in enumerate(A_prog):
        arpejo(SA + i*BAR, ch, 66); baixo(SA + i*BAR, ch, 74); perc_bar(SA + i*BAR)
    bordao.note(SA, n('D2'), 4*BAR - E, 40)

    # B: flauta + contracanto da gamba + cravo
    play_melody(flauta, SB, melB, BAR, 90)
    play_melody(gamba, SB, gambaB, BAR, 80)
    for i, ch in enumerate(B_prog):
        arpejo(SB + i*BAR, ch, 62); cravo_comp(SB + i*BAR, ch); perc_bar(SB + i*BAR, i % 2 == 1)

    # A2: todos, celesta dobra a melodia 1 oitava acima (só notas de tempo forte)
    play_melody(flauta, SA2, melA_fim, BAR, 92)
    for i, ch in enumerate(A_prog[:7] + ['Dm']):
        t = SA2 + i*BAR
        arpejo(t, ch, 70); baixo(t, ch, 80); cravo_comp(t, ch, 58); perc_bar(t, True)
    tt = SA2
    for bar in melA_fim:
        bt = tt
        for note, d in bar:
            if (bt - tt) % (2*E) == 0 and note != 'r':
                celesta.note(bt, n(note) + 12, d*E, hum(60))
            bt += d*E
        tt += BAR
    bordao.note(SA2, n('D2'), 8*BAR - E, 45); bordao.note(SA2, n('A2'), 8*BAR - E, 40)

    # Outro: alaúde sozinho e celesta caindo, volta pro loop
    for i, ch in enumerate(['Dm','C','Bb','Asus']):
        arpejo(OUTRO + i*BAR, ch, 58 - i*3)
    bordao.note(OUTRO, n('D2'), 4*BAR - E, 42)
    for i, x in enumerate(['A6','F6','D6','A5','F5','D5']):
        celesta.note(OUTRO + 2*BAR + i*E, n(x), 2*E, 50 - i*3)
    perc.note(OUTRO + 3*BAR + 4*E, 81, 2*E, 40)

    save('01-tema-do-menu.mid', [cond, flauta, alaude, gamba, cravo, bordao, celesta, perc])

# =====================================================================
# 2) LOOP DA LOJA  "Balcão ao Entardecer"  Sol mixolídio, 6/8, ~99 bpm
# =====================================================================
def loop_loja():
    BAR = 6 * E
    A_prog = [['G'],['F'],['G'],['C'],['G'],['F'],['Am'],['D']]
    B_prog = [['C'],['G'],['Am'],['Em'],['C'],['G'],['Am','D'],['G']]
    melA = [
        [('D5',2),('B4',1),('G4',2),('B4',1)],
        [('C5',2),('A4',1),('F4',2),('A4',1)],
        [('B4',1),('C5',1),('D5',1),('G5',2),('D5',1)],
        [('E5',3),('C5',3)],
        [('D5',2),('B4',1),('G4',2),('B4',1)],
        [('C5',1),('D5',1),('F5',1),('A5',2),('F5',1)],
        [('G5',2),('E5',1),('C5',2),('E5',1)],
        [('D5',3),('A4',1),('B4',1),('C5',1)],
    ]
    melB = [
        [('E5',2),('G5',1),('C6',2),('G5',1)],
        [('B5',2),('G5',1),('D5',3)],
        [('C6',2),('B5',1),('A5',2),('E5',1)],
        [('G5',3),('E5',3)],
        [('E5',1),('F5',1),('G5',1),('A5',2),('G5',1)],
        [('F5',2),('D5',1),('B4',3)],
        [('C5',2),('E5',1),('D5',1),('C5',1),('A4',1)],
        [('G4',3),('r',1),('B4',1),('C5',1)],
    ]
    fagB = [  # contracanto do fagote
        [('E3',3),('G3',3)], [('D3',3),('B2',3)], [('C3',3),('E3',3)], [('B2',3),('G2',3)],
        [('E3',3),('C3',3)], [('D3',3),('F3',3)], [('E3',3),('F#3',3)], [('G3',3),('D3',3)],
    ]
    INTRO = 0
    S = [2*BAR, 10*BAR, 18*BAR, 26*BAR]  # A, A', B, A''
    END = 34*BAR
    cond = conductor('Loop da Loja - Balcao ao Entardecer', 99, 6, 8,
        [(INTRO,'Intro'),(S[0],'A'),(S[1],'A2 - cravo e glock'),(S[2],'B - fagote'),
         (S[3],'A3 - todos'),(END,'Loop')])

    flauta = Track('Flauta doce soprano (Recorder)', 0, 74, 100, 70, 45)
    alaude = Track('Alaude (Nylon Guitar)', 1, 24, 96, 48, 40)
    baixo  = Track('Baixo pizzicato (Pizzicato Strings)', 2, 45, 92, 64, 35)
    cravo  = Track('Cravo (Harpsichord)', 3, 6, 70, 88, 35)
    fagote = Track('Fagote (Bassoon)', 4, 70, 84, 40, 45)
    glock  = Track('Bolhas do caldeirao (Glockenspiel)', 5, 9, 62, 100, 70)
    dulc   = Track('Saltério (Dulcimer)', 6, 15, 74, 30, 50)
    perc   = Track('Percussao de mao (canal 10)', 9, None, 82, 60, 25)

    def chords_in_bar(prog_bar):
        return [(0, prog_bar[0], 6)] if len(prog_bar) == 1 else [(0, prog_bar[0], 3), (3, prog_bar[1], 3)]

    def alaude_bar(t, prog_bar, v=66):
        for off, ch, ln in chords_in_bar(prog_bar):
            r, th, f = tri(ch, 3)
            pat = [r, f, th + 12] if ln == 3 else [r, f, th + 12, f + 12, th + 12, f]
            for i, x in enumerate(pat):
                alaude.note(t + (off + i) * E, x, E + E // 2, hum(v + (10 if i % 3 == 0 else 0)))

    def baixo_bar(t, prog_bar, v=82):
        for off, ch, ln in chords_in_bar(prog_bar):
            r, th, f = tri(ch, 2)
            if r < n('E2'): r += 12; f += 12
            baixo.note(t + off * E, r, E, hum(v))
            if ln == 6:
                baixo.note(t + 3 * E, f if f - 12 < n('E2') else f - 12, E, hum(v - 12))

    def cravo_bar(t, prog_bar, v=58):
        for off, ch, ln in chords_in_bar(prog_bar):
            notes = tri(ch, 4)
            for k in ([1, 2, 4, 5] if ln == 6 else [1, 2]):
                for x in notes: cravo.note(t + (off + k) * E + random.randint(0, 10), x, E - 20, hum(v))

    def perc_bar(t, nivel):
        perc.note(t, 61, E, hum(72))                          # tambor de mão
        perc.note(t + 3 * E, 61, E, hum(58))
        if nivel >= 1:
            perc.note(t + 2 * E, 60, E, hum(44)); perc.note(t + 5 * E, 60, E, hum(40))
        if nivel >= 2:
            for k in (1, 2, 4, 5): perc.note(t + k * E, 54, E, hum(34))  # pandeirola

    ESC = [n(x) for x in ['G3','A3','B3','C4','D4','E4','F4']]
    def terca_abaixo(note):
        x = n(note); pc = [e % 12 for e in ESC]
        i = pc.index(x % 12); j = (i - 2) % 7
        y = x - ((pc[i] - pc[j]) % 12)
        return y

    def glock_bolhas(t):
        # "bolhas": 3 notas agudas aleatórias da escala de Sol mixolídio
        esc = ['G6','A6','B6','C7','D7','E6','F6']
        for k in random.sample(range(6), 3):
            glock.note(t + k * E, n(random.choice(esc)), E, hum(40, 8))

    # Intro
    for i, pb in enumerate([['G'], ['F']]):
        alaude_bar(INTRO + i*BAR, pb, 60); baixo_bar(INTRO + i*BAR, pb, 74); perc_bar(INTRO + i*BAR, 0)

    for sec, start in enumerate(S):
        prog = B_prog if sec == 2 else A_prog
        mel = melB if sec == 2 else melA
        play_melody(flauta, start, mel, BAR, 84 + sec * 3)
        for i, pb in enumerate(prog):
            t = start + i*BAR
            alaude_bar(t, pb, 62 + sec * 2); baixo_bar(t, pb)
            perc_bar(t, min(sec, 2))
            if sec >= 1: cravo_bar(t, pb)
            if sec in (1, 3) and i % 2 == 1: glock_bolhas(t)
        if sec == 2:
            play_melody(fagote, start, fagB, BAR, 74)
            # saltério responde a flauta nos finais de frase
            for i in (1, 3, 5):
                for k, x in enumerate(['D6','B5','G5']):
                    dulc.note(start + i*BAR + (3 + k) * E, n(x), E, hum(56))
        if sec == 3:
            # saltério dobra a melodia em terças abaixo (só tempos fortes)
            tt = start
            for bar in mel:
                bt = tt
                for note, d in bar:
                    if (bt - tt) % (3*E) == 0: dulc.note(bt, terca_abaixo(note), d*E, hum(54))
                    bt += d*E
                tt += BAR
            fagote.note(start + 7*BAR, n('D3'), 3*E, 70); fagote.note(start + 7*BAR + 3*E, n('A2'), 3*E, 66)

    save('02-loop-da-loja.mid', [cond, flauta, alaude, baixo, cravo, fagote, glock, dulc, perc])

# =====================================================================
# 3) EFEITOS CURTOS (stingers)
# =====================================================================
def stingers():
    # Poção pronta: arpejo ascendente em Ré maior com celesta + alaúde + triângulo
    cond = conductor('Pocao pronta (sucesso)', 96, 4, 4, [(0, 'Sucesso')])
    cel = Track('Celesta', 0, 8, 100, 80, 80)
    ala = Track('Alaude (Nylon Guitar)', 1, 24, 96, 50, 60)
    fl  = Track('Flauta doce (Recorder)', 2, 74, 90, 64, 60)
    pc  = Track('Percussao (canal 10)', 9, None, 80, 64, 50)
    for i, x in enumerate(['D5','F#5','A5','D6','F#6','A6']):
        cel.note(i * E // 2 * 1, n(x), 3 * E, 70 + i * 4)
    for x in ['D3','A3','D4','F#4','A4']:
        ala.note(3 * E + random.randint(0, 30), n(x), 5 * E, 80)
    fl.note(3 * E, n('A5'), E, 84); fl.note(4 * E, n('D6'), 4 * E, 92)
    pc.note(3 * E, 81, 4 * E, 70)
    save('03-efeito-pocao-pronta.mid', [cond, cel, ala, fl, pc])

    # Poção falhou: fagote descendo cromático + pizzicato grave + bongô abafado
    cond = conductor('Pocao falhou (lodo)', 84, 4, 4, [(0, 'Falha')])
    fag = Track('Fagote (Bassoon)', 0, 70, 100, 50, 40)
    piz = Track('Baixo pizzicato (Pizzicato Strings)', 1, 45, 96, 70, 30)
    pc  = Track('Percussao (canal 10)', 9, None, 80, 64, 30)
    for i, x in enumerate(['A3','G#3','G3','F#3']):
        fag.note(i * E, n(x), E if i < 3 else 4 * E, 84 - i * 3)
    piz.note(3 * E, n('D2'), 2 * E, 90); piz.note(3 * E, n('D3'), 2 * E, 70)
    pc.note(3 * E, 64, E, 70); pc.note(4 * E, 62, E, 50)   # conga grave / abafada ("bloop")
    save('04-efeito-pocao-falhou.mid', [cond, fag, piz, pc])

    # Cliente chegou: sininho da porta (dois toques) + saltério
    cond = conductor('Cliente chegou (sino da porta)', 100, 4, 4, [(0, 'Sino')])
    sino = Track('Sininho da porta (Tubular Bells)', 0, 14, 80, 64, 70)
    dul  = Track('Saltério (Dulcimer)', 1, 15, 90, 40, 60)
    sino.note(0, n('E6'), 3 * E, 70); sino.note(E, n('B5'), 4 * E, 60)
    for i, x in enumerate(['G5','B5','D6']):
        dul.note(2 * E + i * E // 2, n(x), 2 * E, 64)
    save('05-efeito-cliente-chegou.mid', [cond, sino, dul])

tema_menu(); loop_loja(); stingers()
