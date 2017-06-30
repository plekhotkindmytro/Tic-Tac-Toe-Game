package statistics.dao;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.UpdateOptions;
import org.bson.Document;
import statistics.model.TicTacToeCharacter;
import statistics.model.TicTacToeGame;
import statistics.model.statistics.EventStat;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * Created by D.Plekhotkin on 30/06/2017.
 */
public class TicTacToeDao {

    private final MongoCollection<Document> collection;

    public TicTacToeDao(MongoDatabase database) {
        this.collection = database.getCollection("titactoe");
    }

    public List<TicTacToeCharacter> getStatsByEdition(String neededEdition) {
        List<Document> results = new ArrayList<Document>();
        collection.find(new Document().append("edition", neededEdition)).into(results);
        List<TicTacToeCharacter> chars = new ArrayList<>();
        for (Document document : results) {
            final String playerImg = document.getString("playerImg");
            final String edition = document.getString("edition");
            final int win = document.getInteger("win");
            final int loose = document.getInteger("loose");
            final int tie = document.getInteger("tie");

            chars.add(new TicTacToeCharacter(playerImg, win, loose, tie, edition));
        }

        return chars;
    }

    public void save(TicTacToeGame game) {
        int win = 0;
        int loose = 0;
        int tie = 0;
        switch (game.getGameResult()) {
            case "win":
                win+=1;
                break;
            case "loose":
                loose+=1;
                break;
            case "tie":
                tie+=1;
                break;
        }

        BasicDBObject inc = new BasicDBObject();
        inc.append("win", win);
        inc.append("loose", loose);
        inc.append("tie", tie);
        BasicDBObject incObject = new BasicDBObject().append("$inc", inc);

        BasicDBObject gameObject  = new BasicDBObject();
        gameObject.append("playerImg", "game.getPlayerImg()");
        gameObject.append("edition", game.getEdition());

        collection.updateOne(gameObject, incObject, new UpdateOptions().upsert(true).bypassDocumentValidation(true));

    }
}
