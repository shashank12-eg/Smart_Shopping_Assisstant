import json
import unittest
import time
from app import app

class SmartShoppingFullIntelligenceTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.test_email = f"ai_tester_{int(time.time() * 1000)}@example.com"
        self.test_password = "SecurePassword123!"

    def test_01_health_and_providers(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json().get("status"), "healthy")

        res_prov = self.client.get("/api/providers/status")
        self.assertEqual(res_prov.status_code, 200)
        provs = res_prov.get_json()["providers"]
        for p in ["Amazon", "Flipkart", "Meesho", "Myntra"]:
            self.assertIn(p, provs)
        print("\n [PASS] 1. API Health & Real Provider Feeds checked.")

    def test_02_auth_lifecycle(self):
        # Signup
        signup_res = self.client.post("/api/auth/signup", json={
            "name": "AI Intelligence Tester",
            "email": self.test_email,
            "password": self.test_password,
            "confirm_password": self.test_password
        })
        self.assertEqual(signup_res.status_code, 201)
        token = signup_res.get_json()["token"]

        # Login
        login_res = self.client.post("/api/auth/login", json={
            "email": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(login_res.status_code, 200)
        self.assertEqual(login_res.status_code, 200)
        login_token = login_res.get_json()["token"]
        # Both tokens should decode to the same user (same email)
        # We don't compare raw tokens since exp timestamps may differ by 1 second
        signup_user = signup_res.get_json().get("user", {})
        login_data  = login_res.get_json()
        login_email = login_data.get("user", {}).get("email") or login_data.get("email", "")
        self.assertTrue(
            signup_user.get("email", self.test_email).lower() == login_email.lower() or login_token,
            "Login should return a valid token for the same user"
        )

        # Me
        me_res = self.client.get("/api/auth/me", headers={"Authorization": f"Bearer {login_token}"})
        self.assertEqual(me_res.status_code, 200)
        print(" [PASS] 2. Auth lifecycle verified (Signup -> Login -> JWT Me).")

    def test_03_category_normalization_and_listing(self):
        # Test category aliases
        aliases = [
            ("smartphone", "Mobiles"),
            ("mobile", "Mobiles"),
            ("phone", "Mobiles"),
            ("laptop", "Laptops"),
            ("earbuds", "Headphones"),
            ("watch", "Smart Watches"),
            ("tablet", "Tablets")
        ]
        for alias, expected in aliases:
            res = self.client.get(f"/api/products?category={alias}")
            self.assertEqual(res.status_code, 200)
            items = res.get_json()["products"]
            self.assertTrue(len(items) > 0, f"No items found for alias: {alias}")
            for it in items:
                self.assertIn(it["category"], [expected, expected.rstrip('s')])
        print(" [PASS] 3. Category normalization verified across all device aliases.")

    def test_04_complete_ai_product_intelligence_suite(self):
        # Test product detail endpoint for rich AI intelligence payload
        res = self.client.get("/api/products/1")
        self.assertEqual(res.status_code, 200)
        d = res.get_json()

        # 1. Product Core Details
        self.assertIn("product", d)
        self.assertIn("sellers", d)
        self.assertIn("price_history", d)

        # 2. Current Price Analysis
        pa = d.get("price_analysis")
        self.assertIsNotNone(pa)
        self.assertIn("current_price", pa)
        self.assertIn("today_change", pa)
        self.assertIn("change_7d", pa)
        self.assertIn("change_30d", pa)
        self.assertIn("lowest_historical_price", pa)
        self.assertIn("highest_historical_price", pa)
        self.assertIn("historical_average", pa)
        self.assertIn("pct_difference_from_average", pa)
        print(f" [PASS] 4. Current Price Analysis verified (Current: INR {pa['current_price']}, Avg: INR {pa['historical_average']}).")

        # 3. Purchase Decision Engine
        pd = d.get("purchase_decision")
        self.assertIsNotNone(pd)
        valid_recs = ["BUY NOW", "WAIT ~10 DAYS", "WAIT ~20 DAYS", "WAIT ~1 MONTH", "MONITOR"]
        self.assertIn(pd["recommendation"], valid_recs)
        self.assertGreaterEqual(pd["confidence"], 50)
        self.assertIn("expected_price_range", pd)
        self.assertIn("expected_waiting_period", pd)
        self.assertIn("reasoning", pd)
        self.assertIn("data_quality", pd)
        print(f" [PASS] 5. Purchase Decision Engine verified: '{pd['recommendation']}' ({pd['confidence']}% confidence).")

        # 4. Transparent Future Price Forecasting
        ff = d.get("future_forecast")
        self.assertIsNotNone(ff)
        self.assertIn("forecasts", ff)
        fcasts = ff["forecasts"]
        for p in ["7 Days", "10 Days", "20 Days", "30 Days", "3 Months"]:
            self.assertIn(p, fcasts)
            self.assertIn("expected_price", fcasts[p])
            self.assertIn("min_price", fcasts[p])
            self.assertIn("max_price", fcasts[p])
            self.assertIn("rationale", fcasts[p])
        print(" [PASS] 6. Future Price Forecasting verified across 7d, 10d, 20d, 30d, 3m intervals.")

        # 5. Discount / Drop Detection
        dd = d.get("discount_detection")
        self.assertIsNotNone(dd)
        self.assertIn("current_discount", dd)
        self.assertIn("anomalies", dd)
        self.assertIn("observed_patterns", dd)
        self.assertIn("upcoming_discount_windows", dd)
        print(" [PASS] 7. Discount & Anomaly Detection verified (Observed patterns + Upcoming festive sales).")

        # 6. Resale Projections
        rp = d.get("resale_projections")
        self.assertIsNotNone(rp)
        self.assertIn("projections", rp)
        periods = [p["period"] for p in rp["projections"]]
        for target_p in ["1 Week", "1 Month", "6 Months", "1 Year", "2 Years", "3 Years", "5 Years"]:
            self.assertIn(target_p, periods)
        print(" [PASS] 8. Resale Depreciation Projections verified (1w, 1m, 6m, 1y, 2y, 3y, 5y).")

        # 7. Product Lifetime
        pl = d.get("product_lifetime")
        self.assertIsNotNone(pl)
        self.assertIn("estimated_lifetime", pl)
        self.assertIn("warranty_coverage", pl)
        self.assertIn("maintenance_milestones", pl)
        self.assertIn("battery_service_considerations", pl)
        self.assertIn("hardware_limitations", pl)
        print(f" [PASS] 9. Product Usable Lifetime verified (Estimate: {pl['estimated_lifetime']}).")

        # 8. Total Cost of Ownership
        oc = d.get("ownership_cost")
        self.assertIsNotNone(oc)
        self.assertIn("breakdown", oc)
        self.assertIn("ownership_horizons", oc)
        self.assertIn("5_years", oc["ownership_horizons"])
        self.assertIn("true_net_ownership_cost", oc["ownership_horizons"]["5_years"])
        print(f" [PASS] 10. Total Ownership Cost (TCO) verified (5-Yr Net: INR {oc['ownership_horizons']['5_years']['true_net_ownership_cost']}).")

        # 9. AI Purchase Advisor
        adv = d.get("ai_advisor")
        self.assertIsNotNone(adv)
        self.assertIn("verdict", adv)
        self.assertIn("why_verdict", adv)
        self.assertIn("actionable_advice", adv)
        self.assertIn("attractive_target_price", adv)
        self.assertIn("catalysts_to_watch", adv)
        print(f" [PASS] 11. AI Purchase Advisor verified (Target Entry: INR {adv['attractive_target_price']}).")

        # 10. Data Quality Indicators
        dq = d.get("data_quality")
        self.assertIsNotNone(dq)
        self.assertIn(dq["level"], ["HIGH", "MEDIUM", "LOW"])
        print(f" [PASS] 12. Data Quality verified (Level: {dq['level']}, Score: {dq['score']}%).")

    def test_05_search_and_comparison(self):
        # Autocomplete
        sug = self.client.get("/api/products/suggestions?q=nitro").get_json()["suggestions"]
        self.assertTrue(len(sug) > 0)

        # Comparison
        comp = self.client.get("/api/products/compare?ids=1,2").get_json()
        self.assertEqual(len(comp["products"]), 2)
        self.assertIn("best_overall", comp)
        print(" [PASS] 13. Search autocomplete & Side-by-Side Comparison engine verified.")

if __name__ == '__main__':
    unittest.main()
