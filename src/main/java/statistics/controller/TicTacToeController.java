package statistics.controller;

import com.google.gson.Gson;
import statistics.dao.TicTacToeDao;
import statistics.model.TicTacToeGame;

import static spark.Spark.get;

/**
 * Created by D.Plekhotkin on 30/06/2017.
 */
public class TicTacToeController {

    private TicTacToeDao ticTacToeDao;

    public TicTacToeController(TicTacToeDao ticTacToeDao) {
        this.ticTacToeDao = ticTacToeDao;
        initializeRoutes();
    }

    private void initializeRoutes() {
        get("/tictactoe/addGame", (request, response) -> {
            Gson gson = new Gson();
            TicTacToeGame game = gson.fromJson(request.body(), TicTacToeGame.class);
            ticTacToeDao.save(game);
            return true;

        }, new JsonTransformer());

        get("/tictactoe/:edition/stats", (request, response) -> {
            String edition = request.params(":edition");
            return ticTacToeDao.getStatsByEdition(edition);
        }, new JsonTransformer());

    }
}
