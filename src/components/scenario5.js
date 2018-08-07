export default {
  "identifier": "just_a_test",
  "portfolio_config": {
    "portfolio_start": "20160101", 
    "portfolio_end": "20170405", 
    "terminal_expected_value": 120000,
    "investables": {
      "cash": {
        "universe": ["000198.OF"]
      },
      "equity": {
        "universe": ["000300.SH"] 
      }
    },
    "init_portfolio": {
      "volumes": [
        {"symbol": "000198.OF", "volume": 89414}
      ],
      "uninvested_cash": 0
    },
    "roundlotter": "betaboost.core.strategy_template.allocate_passive.default_roundlotter"
  },
  "event_schedules": [
    {
      "type": "marketdata",
      "function": "betaboost.core.context.histdata_schedule"
    },
    {
      "type": "planner",
      "frequency": "BQ"
    },
    {
      "type": "allocator",
      "frequency": "BQ",
      "avoid": "rebalancer"
    },
    {
      "type": "rebalancer",
      "frequency": "BM"
    }
  ],
  "investment_strategy": {
    "template": "allocate_passive",
    "config": {},
    "building_blocks": {
      "rebalancer": {
        "type": "rebalancer",
        "ref": "fixed_rb"
      },
      "initializer": {
        "type": "allocator",
        "ref": "cash"
      },
      "allocator": {
        "type": "allocator",
        "ref": "alloc_switcher"
      },
      "planner": {
        "type": "planner",
        "ref": "smart_planner"
      }
    },
    "components": {
	  "allocator": {
	  	"root": {
	      "function": "betaboost.core.strategy.allocation.allocate_fixed",
	      "config": [
	        {"target":"equity", "weighting": 0.6},
	        {"target":"cash", "weighting": 0.4}
	      ]
	    },
	    "hs300_fixed": {
	      "function": "betaboost.core.strategy.allocation.allocate_fixed",
	      "config": [
	        {"target":"000300.SH", "weighting": 0.6},
	        {"target":"000198.OF", "weighting": 0.4}
	      ]
	    },
	    
	    "alloc_switcher": {
	      "function": "betaboost.core.strategy.allocation.allocate_switcher",
	      "config": {
	        "target": ["000300.SH", "000198.OF"],
	        "factor": "prices",
	        "weight_picker": "betaboost.core.strategy.allocation.picker_2_2",
	        "weights": [
	          [0.8, 0.2],
	          [0.2, 0.8]
	        ]
	      }
	    },
	    
	    "equity": {
	      "function": "betaboost.core.strategy.allocation.allocate_fixed",
	      "config": [
	        {"target":"000300.SH", "weighting": 0.6},
	        {"target":"FakeSym", "weighting": 0.4}
	      ]
	    },
	    "cash": {
	      "function": "betaboost.core.strategy.allocation.allocate_fixed",
	      "config": [
	        {"target":"000198.OF", "weighting": 1.0}
	      ]
	    },
	    "erc_vol": {
	      "function": "betaboost.core.strategy.allocation.allocate_equal_risk_contribution",
	      "config": {
	        "risk_measure": "qi4portfolio.riskmeasure.marginal_volatility",
	        "window": 128,
	        "cov_method": "pearson"
	      }
	    },
	    "erc_vol_factor": {
	      "function": "betaboost.core.strategy.allocation.allocate_equal_risk_contribution",
	      "config": {
	        "risk_measure": "qi4portfolio.riskmeasure.marginal_volatility",
	        "factor_loading": ["size", "liquidity", "growth"],
	        "window": 128,
	        "cov_method": "pearson"
	      }
	    },
	    "erc_vol_diversification": {
	      "function": "betaboost.core.strategy.allocation.allocate_equal_risk_contribution",
	      "config": {
	        "risk_measure": "qi4portfolio.riskmeasure.diversification_index",
	        "window": 128,
	        "cov_method": "pearson"
	      }
	    },
	    "risk_budge_basic": {
	      "function": "betaboost.core.strategy.allocation.",
	      "config": {
	        "risk_measure": "qi4portfolio.riskmeasure.marginal_volatility",
	        "factor_loading": ["size", "liquidity", "growth"],
	        "cov_method": "pearson"
	      }
	    }
	    
	  },
	  "rebalancer": {
	    "fixed_rb": {
	      "function": "betaboost.core.strategy.rebalance.constant_mix",
	      "config": {
	        "rebalance_weighting_threshold": 0.005
	      }
	    }
	  },
	  
	  "selector": {
	    "stock_select": {
	      "function": "betaboost.core.strategy.selection.vanilla_select",
	      "config": {
	      }
	    }
	  },
	  
	  "planner": {
	    "vanilla_planner": {
	      "function": "betaboost.core.strategy.planner.vanilla_aip",
	      "config": {
	        "deposit": 1000
	      }
	    },
	    "smart_planner": {
	      "function": "betaboost.core.strategy.planner.smart_aip",
	      "config": {
	        "deposit_low": 500,
	        "deposit_high": 1500,
	        "signal": "prices",
	        "proxy": "FakeSym",
	        "threshold": 8.06
	      }
	    }
	  }
    }
  }
}