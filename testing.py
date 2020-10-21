from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from random_words import RandomWords

class User:
    def __init__(self, name, roomid = False, leader = False):
        self.name = name
        self.leader = leader
        self.roomid = roomid
        self.driver = webdriver.Chrome()
        self.driver.get('localhost:3000')
        

    def join(self):
        usernameInput = self.driver.find_element_by_class_name('usernameInput')
        usernameInput.send_keys(self.name)

        if self.leader:
            createRoom = self.driver.find_element_by_class_name('createroom__button')
            createRoom.click()
        else:
            roomInput = self.driver.find_element_by_class_name('joinroom__input')
            roomInput.send_keys(self.roomid)
            joinRoom = self.driver.find_element_by_class_name('joinroom__button')
            joinRoom.click()

    def typeWords(self):
        try:
            wordInput = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "words__input")))
        finally:
            rw = RandomWords()
            words = rw.random_words(count=5)
            for word in words:
                wordInput.send_keys(word)
                wordInput.send_keys(Keys.ENTER)

    def getRoomId(self):
        try:
            roomId = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "lobby__idlink")))
        finally:
            return roomId.text


leader = User(name='Lobby Leader', leader=True)
leader.join()

print(leader.getRoomId())

players = [
    User(name='Player 1', roomid=leader.getRoomId()),
    User(name='Player 2', roomid=leader.getRoomId())
]

for player in players:
    player.join()

for player in players:
    player.typeWords()

leader.typeWords()
