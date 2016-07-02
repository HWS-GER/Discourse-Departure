# name: departure-board
# about: Adds the flapper library to the latest feed
# version: 0.1
# author: Joe Buhlig joebuhlig.com
# url: https://github.com/SingerAndPartner/departure-board


enabled_site_setting :departure_board_enabled

register_asset "stylesheets/flapper.css"
register_asset "stylesheets/departure-board.css"
register_asset "javascripts/jquery.transform-0.9.3.js"
register_asset "javascripts/jquery.flapper.js"
register_asset "javascripts/departure-board.js"

after_initialize do
  if SiteSetting.departure_board_enabled

    Discourse.top_menu_items.push(:home)
    Discourse.filters.push(:home)
    Discourse.anonymous_filters.push(:home)

    require_dependency 'list_controller'
    class ::ListController
      def home
        user = list_target_user
        list_opts = build_topic_list_options
        list_opts[:per_page] = 10
        list = TopicQuery.new(user, list_opts).public_send("list_latest")
        list.topics.each do |topic|
          topic.title = topic.title.upcase
        end
        respond_with_list(list)
      end
    end

    Discourse::Application.routes.append do
      get "home" => "list#home"
    end
  end
end