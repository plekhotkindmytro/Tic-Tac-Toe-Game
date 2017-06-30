package statistics.model;

/**
 * Created by D.Plekhotkin on 30/06/2017.
 */
public class TicTacToeCharacter {

    private String playerImg;
    private int win;
    private int loose;
    private int tie;
    private String edition;
    public TicTacToeCharacter(){}

    public TicTacToeCharacter(String playerImg, int win, int loose, int tie, String edition) {
        this.playerImg = playerImg;
        this.win = win;
        this.loose = loose;
        this.tie = tie;
        this.edition = edition;
    }

    public String getPlayerImg() {
        return playerImg;
    }

    public void setPlayerImg(String playerImg) {
        this.playerImg = playerImg;
    }

    public int getWin() {
        return win;
    }

    public void setWin(int win) {
        this.win = win;
    }

    public int getLoose() {
        return loose;
    }

    public void setLoose(int loose) {
        this.loose = loose;
    }

    public int getTie() {
        return tie;
    }

    public void setTie(int tie) {
        this.tie = tie;
    }

    public String getEdition() {
        return edition;
    }

    public void setEdition(String edition) {
        this.edition = edition;
    }
}
