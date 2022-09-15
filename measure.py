#!/usr/bin/env python3

from time import sleep
import MySQLdb as mariadb
import numpy as np
import sounddevice as sd
 
HOST_IP_ADDRESS = '192.168.25.212'
CLASSROOM = 'T4.12'
INTERVAL = 10 # In seconden
SENSITIVITY = 50
VERBOSE = True

DATABASE_CONFIG = {
    'user': 'schrijver', # Deze user heeft INSERT permissies. Gebruik "lezer" als alleen SELECT wordt gebruikt.
    'password': 'WindesheimICTHeeftZiektes!',
    'host': HOST_IP_ADDRESS,
    'database': 'geluid'
}


def db_insert(measurement, connection):
    """
    db_insert Voegt measurement toe aan de database.
    :param measurement: volume niveau in dBa
    :param connection: actieve database verbinding
    :return: 
    """
    cursor = connection.cursor()
    try:
        cursor.execute('INSERT INTO meting (waarde, classroom) VALUES (%s, %s);', (measurement,CLASSROOM))
        connection.commit()
        if VERBOSE:
            print(f'Meting {measurement} toegevoegd aan database')
    except Exception as error:
        print(error)

def get_volume_level():
    """
    get_volume_level leest huidige volume van de microfoon.
    :return: volume (in dBa)
    """
    stream = sd.InputStream()
    stream.start()
    frame = stream.read(1)[0]
    volume = (np.linalg.norm(frame) * SENSITIVITY)
    stream.stop()
    stream.close()
    return volume


def main():
    try:
        try:
            connection = mariadb.connect(**DATABASE_CONFIG)
        except:
            print('Error: kon geen verbinding maken met de database')
            return

        while True:
            volume = get_volume_level()
            db_insert(volume, connection)
            sleep(INTERVAL)


    except Exception as error:
        print(error)
        connection.close()



if __name__ == '__main__':
    main()
