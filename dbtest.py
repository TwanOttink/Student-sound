#!/usr/bin/env python3
import MySQLdb as mariadb

HOST_IP_ADDRESS = "192.168.25.212"
VERBOSE = True

def main():
    try:
        dbconfig = {
            'user': 'lezer',
            'password': 'WindesheimICTHeeftZiektes!',
            'host': HOST_IP_ADDRESS,
            'database': 'geluid'
        }
        connection = mariadb.connect(**dbconfig)
        print(f'Verbonden met database als gebruiker: {dbconfig["user"]}')
        connection.close()
        dbconfig['user'] = 'schrijver'
        connection = mariadb.connect(**dbconfig)
        print(f'Verbonden met database als gebruiker: {dbconfig["user"]}')
        connection.close()
        print('De database werkt.')
    except:
        print(f'Kon geen verbinding maken met de database.')



if __name__ == '__main__':
    main()
